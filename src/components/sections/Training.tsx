"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useEffect, useRef, useState } from "react";
import { training } from "@/content/profile";
import { useIntro } from "../providers/Intro";
import { useReach } from "../providers/Reach";
import { Kinetic, Rise } from "../ui/Kinetic";
import { SectionLabel } from "../ui/SectionLabel";

gsap.registerPlugin(TextPlugin);

const HOLD_S = 3.2;

export function Training() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [typed, setTyped] = useState<string | null>(null);
  const [declined, setDeclined] = useState(false);
  const session = training[active];
  const { openContact } = useReach();
  const hire = session.id === "hire";
  const asking = hire && typed === "hire";

  const pick = (i: number) => {
    setTyped(null);
    setDeclined(false);
    setActive(i);
  };
  const accept = () => openContact({ topic: "A role", message: "Hi Abel, your terminal said you're open to work. " });

  // The last tab ends on a real question; y or Enter answers it from the keyboard.
  useEffect(() => {
    if (!asking || !inView || declined) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea")) return;
      if (e.key === "y" || e.key === "Y" || e.key === "Enter") accept();
      if (e.key === "n" || e.key === "N") setDeclined(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useGSAP(
    () => {
      if (!ready) return;
      ScrollTrigger.create({
        trigger: "[data-terminal]",
        start: "top 80%",
        end: "bottom 20%",
        onToggle: (self) => setInView(self.isActive),
      });
    },
    { dependencies: [ready], scope: root },
  );

  // Types the session out, holds it, then moves to the next one.
  useGSAP(
    () => {
      if (!inView) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-type]");
      gsap.set(lines, { text: "" });
      gsap.set("[data-out]", { autoAlpha: 0 });
      const tl = gsap.timeline({ delay: 0.3 });
      lines.forEach((el, i) => {
        const text = el.dataset.text ?? "";
        if (i > 0) tl.set(el.closest("[data-out]"), { autoAlpha: 1 }, "+=0.25");
        tl.to(el, { text: { value: text }, duration: Math.max(0.35, text.length * 0.028), ease: "none" });
      });
      const last = training[active].id === "hire";
      gsap.fromTo(
        "[data-progress]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: tl.duration() + 0.3 + (last ? 0 : HOLD_S),
          ease: "none",
          transformOrigin: "0% 50%",
        },
      );
      tl.call(() => {
        // the hire tab stays put and waits for an answer
        if (last) return setTyped("hire");
        gsap.delayedCall(HOLD_S, () => {
          setTyped(null);
          setActive((a) => (a + 1) % training.length);
        });
      });
    },
    { dependencies: [active, inView], scope: root, revertOnUpdate: true },
  );

  return (
    <section ref={root} id="training" data-stage="training" className="frame relative z-[2] py-28 md:py-40">
      <div className="cols">
        <div className="col-span-4">
          <SectionLabel index="04" title="AI training" />
          <Kinetic as="h2" className="display mt-8 text-[clamp(2.1rem,4.6vw,5rem)] leading-[1.06]">
            I train the models,
            <br />
            <span className="outline-text">and build with them.</span>
          </Kinetic>
          <Rise as="p" className="mt-8 max-w-[44ch] text-[18px] leading-relaxed text-muted md:text-[20px]">
            RLHF, SWE-Bench and Terminal-Bench style tasks, long-horizon agent work, and LangChain or LangGraph when
            it&apos;s time to ship something real.
          </Rise>
        </div>
      </div>

      <div className="cols mt-14 md:mt-20">
        <Rise className="col-span-4">
          {/* the kinds of work, as tabs */}
          <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] md:mx-0 md:px-0" role="tablist">
            <div className="flex w-max gap-2 md:w-auto md:flex-wrap">
              {training.map((t, i) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => pick(i)}
                  className={`label relative overflow-hidden rounded-full border px-4 py-2.5 transition-colors duration-300 ${
                    i === active
                      ? "border-fg bg-fg text-bg"
                      : "border-line-strong text-muted hover:border-fg hover:text-fg"
                  }`}
                >
                  {t.id === "hire" && (
                    <span className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-current [animation:pulse-dot_2s_ease-in-out_infinite]" />
                  )}
                  {t.name}
                  {i === active && <span data-progress className="absolute inset-x-0 bottom-0 h-[2px] bg-bg/50" />}
                </button>
              ))}
            </div>
          </div>

          <div
            data-terminal
            role="tabpanel"
            className="mt-6 overflow-hidden rounded-2xl border border-line-strong bg-raised/85 backdrop-blur-md"
          >
            <div className="flex items-center gap-4 border-b border-line px-5 py-3.5">
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full border border-faint" />
                <span className="size-2.5 rounded-full border border-faint" />
                <span className="size-2.5 rounded-full bg-fg" />
              </span>
              <span className="label truncate text-muted">abel@training: ~/{session.id}</span>
            </div>

            <div
              key={session.id}
              className="min-h-[300px] p-5 font-mono text-[14px] leading-[1.9] md:p-8 md:text-[16px]"
            >
              <p className="text-muted"># {session.note}</p>
              <p className="mt-4">
                <span className="text-muted">$ </span>
                <span data-type data-text={session.prompt}>
                  {session.prompt}
                </span>
              </p>
              {session.lines.map((line) => (
                <p key={line} data-out className="whitespace-pre-wrap text-fg/85">
                  <span className="text-muted">&gt; </span>
                  <span data-type data-text={line}>
                    {line}
                  </span>
                </p>
              ))}
              {asking && (
                <div className="mt-3">
                  <p>
                    <span className="text-muted">? </span>send a message?{" "}
                    <button onClick={accept} className="rounded bg-fg px-1.5 text-bg hover:opacity-80">
                      Y
                    </button>
                    <span className="text-muted"> / </span>
                    <button onClick={() => setDeclined(true)} className="text-muted underline-offset-4 hover:underline">
                      n
                    </button>
                  </p>
                  <p className="text-muted">
                    {declined
                      ? "> no worries. the form is at the bottom whenever you're ready"
                      : "> press y, or click it"}
                  </p>
                </div>
              )}
              <span
                aria-hidden
                className="mt-2 inline-block h-[1.1em] w-[0.6em] translate-y-[3px] bg-fg [animation:pulse-dot_1s_steps(1)_infinite]"
              />
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
