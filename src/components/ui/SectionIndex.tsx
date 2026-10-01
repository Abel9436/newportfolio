"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { useIntro } from "../providers/Intro";

const ORDER = [
  { id: "top", label: "Intro" },
  { id: "profile", label: "Profile" },
  { id: "work", label: "Work" },
  { id: "words", label: "Kind words" },
  { id: "experience", label: "Experience" },
  { id: "training", label: "AI training" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact" },
];

// The vertical "02 — 06" readout on the right edge.
export function SectionIndex() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      gsap.from(root.current, { autoAlpha: 0, x: 20, duration: 1, ease: "expo.out", delay: 0.6 });
      ORDER.forEach((s, i) => {
        const section = document.getElementById(s.id);
        if (!section) return;
        // a pinned section is measured through its spacer, which spans the whole pin
        const parent = section.parentElement;
        const el = parent?.classList.contains("pin-spacer") ? parent : section;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => gsap.set(fill.current, { scaleY: self.progress }),
      });
    },
    { dependencies: [ready], scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed right-[calc(var(--gutter)/2)] top-1/2 z-40 hidden -translate-y-1/2 translate-x-1/2 flex-col items-center gap-4 mix-blend-difference md:flex"
    >
      <span className="label tabular-nums text-white">0{active + 1}</span>
      <div className="relative h-24 w-px bg-white/20">
        <div ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-white" />
      </div>
      <span className="label tabular-nums text-white/40">0{ORDER.length}</span>
      <span className="label mt-2 text-white/60 [writing-mode:vertical-rl]">{ORDER[active].label}</span>
    </div>
  );
}
