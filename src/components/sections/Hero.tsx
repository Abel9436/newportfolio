"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useEffect, useRef, useState } from "react";
import { disciplines, profile } from "@/content/profile";
import { useIntro } from "../providers/Intro";
import { useReach } from "../providers/Reach";
import { Kinetic } from "../ui/Kinetic";

gsap.registerPlugin(ScrambleTextPlugin);

// Cycles through the three roles, each one resolving out of noise.
function RoleTicker() {
  const ref = useRef<HTMLSpanElement>(null);
  const { ready } = useIntro();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % disciplines.length), 2800);
    return () => window.clearInterval(id);
  }, [ready]);

  useGSAP(
    () => {
      if (!ready || !ref.current) return;
      gsap.to(ref.current, {
        duration: 0.8,
        ease: "none",
        scrambleText: { text: disciplines[i], chars: "01/<>_", speed: 0.8 },
      });
    },
    { dependencies: [i, ready] },
  );

  return (
    <span ref={ref} className="text-fg">
      {disciplines[0]}
    </span>
  );
}

function Letters({ word }: { word: string }) {
  return word.split("").map((c, i) => (
    <span key={i} className="inline-block overflow-hidden align-top">
      <span data-hero-char className="inline-block">
        {c}
      </span>
    </span>
  ));
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();
  const { openContact } = useReach();

  useGSAP(
    () => {
      if (!ready) return;
      gsap
        .timeline({ delay: 0.15 })
        .from("[data-hero-block]", { scaleY: 0, duration: 1.1, ease: "expo.inOut" }, 0)
        .from("[data-hero-char]", { yPercent: 105, duration: 1.4, ease: "expo.out", stagger: 0.05 }, 0.25)
        .from("[data-hero-meta]", { autoAlpha: 0, y: 14, duration: 0.9, ease: "power3.out", stagger: 0.06 }, 0.6)
        .from("[data-hero-rule]", { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0.4);

      const leave = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-first]", { xPercent: -10, ease: "none", scrollTrigger: leave });
      gsap.to("[data-hero-last]", { xPercent: 10, ease: "none", scrollTrigger: leave });
    },
    { dependencies: [ready], scope: root },
  );

  return (
    <section ref={root} id="top" data-stage="hero" className="frame relative h-svh min-h-[560px]">
      {/* the name sits behind the figure */}
      <h1
        aria-label={profile.name}
        className="display pointer-events-none absolute inset-x-[var(--gutter)] top-[18%] z-0 select-none md:top-[15%]"
      >
        <span data-hero-first className="block text-[23vw] md:text-[17.5vw]">
          {/* first letter printed in reverse, like a stamp */}
          <span className="relative mr-[0.03em] inline-block px-[0.04em] text-bg">
            <span data-hero-block className="absolute inset-0 origin-bottom bg-fg" />
            <span className="relative">
              <Letters word="A" />
            </span>
          </span>
          <Letters word="BEL" />
        </span>
        <span data-hero-last className="mt-[4vw] block text-right text-[15.5vw] md:mt-[1vw] md:text-[12vw]">
          <Letters word="BEKELE" />
        </span>
      </h1>

      <div className="cols relative z-[2] pt-20 md:pt-24">
        <p data-hero-meta className="label col-span-2 text-muted md:col-span-1">
          <RoleTicker />
          <br />
          Ethiopia
        </p>
        <div data-hero-meta className="col-span-2 flex justify-end md:col-span-1 md:col-start-6">
          <button
            onClick={() => openContact({ topic: "A role" })}
            className="label group flex items-start gap-2 text-right text-fg"
          >
            <span className="mt-[4px] size-1.5 rounded-full bg-fg [animation:pulse-dot_2s_ease-in-out_infinite]" />
            <span className="link-line">Open to work</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              &#8599;
            </span>
          </button>
        </div>
      </div>

      <div className="absolute inset-x-[var(--gutter)] bottom-8 z-[2] text-white mix-blend-difference md:bottom-10">
        {/* inverts against whatever is behind it, figure or paper */}
        <span data-hero-rule className="mb-5 block h-px origin-left bg-white/25" />
        <div className="cols items-end gap-y-6">
          <Kinetic
            as="p"
            onIntro
            delay={0.7}
            className="col-span-4 max-w-[34ch] text-[17px] leading-snug text-white md:col-span-2 md:text-[20px]"
          >
            I build AI systems and automations in Python, and help train the models behind them.
          </Kinetic>
          <p data-hero-meta className="label col-span-2 hidden text-white/55 md:col-start-4 md:block">
            Portfolio / 2026
          </p>
          <div
            data-hero-meta
            className="label col-span-2 flex items-center gap-3 text-white/55 md:col-span-1 md:col-start-6 md:justify-end"
          >
            <span className="relative block h-8 w-px overflow-hidden bg-white/25">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_cubic-bezier(0.7,0,0.2,1)_infinite] bg-white" />
            </span>
            Scroll
          </div>
        </div>
      </div>
    </section>
  );
}
