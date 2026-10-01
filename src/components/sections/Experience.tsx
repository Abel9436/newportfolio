"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { disciplines, experience } from "@/content/profile";
import { useIntro } from "../providers/Intro";
import { useReach } from "../providers/Reach";
import { Rise } from "../ui/Kinetic";
import { SectionLabel } from "../ui/SectionLabel";

gsap.registerPlugin(ScrambleTextPlugin);

const CYCLE_MS = 3200;

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();
  const [auto, setAuto] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const active = picked ?? auto;
  const { openContact } = useReach();

  // Only cycle while the section is on screen and nobody is pointing at a role.
  useGSAP(
    () => {
      if (!ready) return;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        end: "bottom 30%",
        onToggle: (self) => setInView(self.isActive),
      });
    },
    { dependencies: [ready], scope: root },
  );

  useEffect(() => {
    if (!inView || picked !== null) return;
    const id = window.setInterval(() => setAuto((i) => (i + 1) % disciplines.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [inView, picked]);

  // Whichever role takes focus resolves out of noise.
  useGSAP(
    () => {
      if (!inView) return;
      const el = root.current?.querySelector<HTMLElement>(`[data-role='${active}'] [data-scramble]`);
      if (!el) return;
      gsap.to(el, {
        duration: 0.9,
        ease: "none",
        scrambleText: { text: disciplines[active], chars: "01/<>_", speed: 0.7, revealDelay: 0.15 },
      });
    },
    { dependencies: [active, inView], scope: root },
  );

  return (
    <section ref={root} id="experience" data-stage="experience" className="frame relative z-[2] py-28 md:py-40">
      <div className="cols">
        <div className="col-span-4">
          <SectionLabel index="04" title="Experience" />
          <p className="label mt-8 text-muted">What I do</p>
          <ul className="mt-4" onMouseLeave={() => setPicked(null)}>
            {disciplines.map((d, i) => (
              <li key={d} data-role={i}>
                <button
                  type="button"
                  onMouseEnter={() => setPicked(i)}
                  onFocus={() => setPicked(i)}
                  onBlur={() => setPicked(null)}
                  onClick={() => setPicked((p) => (p === i ? null : i))}
                  aria-pressed={picked === i}
                  className="group flex w-full items-baseline gap-4 py-1 text-left md:gap-6"
                >
                  <span className="label w-6 shrink-0 text-muted tabular-nums">0{i + 1}</span>
                  <span
                    data-scramble
                    className={`display text-[clamp(2rem,4.8vw,5.4rem)] leading-[1.3] md:leading-[1.15] transition-[color,-webkit-text-stroke-color] duration-500 ${
                      i === active ? "text-fg" : "outline-text [-webkit-text-stroke-color:var(--faint)]"
                    }`}
                  >
                    {d}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* the role on screen doubles as the pitch */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-8">
            <p className="text-[17px] text-muted md:text-[19px]">
              Hiring an <span className="text-fg">{disciplines[active]}</span>?
            </p>
            <button
              onClick={() =>
                openContact({
                  topic: "A role",
                  message: `Hi Abel, we're looking for an ${disciplines[active]}. Here's the role: `,
                })
              }
              className="label group inline-flex items-center gap-3 rounded-full bg-fg px-5 py-3 text-bg transition-transform duration-300 hover:scale-[1.04]"
            >
              Let&apos;s talk
              <span className="transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
            </button>
          </div>
        </div>
      </div>

      <div className="cols mt-14 md:mt-20">
        <ol className="col-span-4 border-t border-line-strong">
          {experience.map((role, i) => {
            const dim = picked !== null && !role.tracks.includes(picked);
            return (
              <Rise as="li" key={role.company} delay={i * 0.04} className="group relative border-b border-line">
                <div className={`transition-opacity duration-500 ${dim ? "opacity-20" : "opacity-100"}`}>
                  {/* hover prints the row in reverse */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-fg transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100"
                  />
                  <div className="relative grid gap-y-2 py-6 transition-colors duration-500 group-hover:text-bg md:grid-cols-[1fr_1.7fr_2.2fr] md:items-baseline md:gap-x-8 md:px-5 md:py-8">
                    <p className="label tabular-nums text-muted transition-colors duration-500 group-hover:text-bg/60">
                      {role.period}
                    </p>
                    <h3 className="display text-[clamp(1.3rem,1.9vw,2rem)] leading-tight">
                      {role.company}
                      <span className="label mt-1 block text-muted transition-colors duration-500 group-hover:text-bg/60">
                        {role.title}
                      </span>
                    </h3>
                    <p className="text-[16px] leading-relaxed text-muted transition-colors md:text-[17px] duration-500 group-hover:text-bg/75">
                      {role.note}
                    </p>
                  </div>
                </div>
              </Rise>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
