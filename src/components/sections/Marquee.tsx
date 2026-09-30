"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

const TOP = ["Python", "AI", "Automation", "Backends"];
const BOTTOM = ["RLHF", "Model training", "Data pipelines", "APIs"];

function Row({ words, outline }: { words: string[]; outline?: boolean }) {
  const line = [...words, ...words, ...words];
  return (
    <div
      className={`display flex shrink-0 gap-[0.5em] whitespace-nowrap text-[11vw] leading-[1.05] md:text-[7.5vw] ${
        outline ? "text-transparent [-webkit-text-stroke:1px_var(--line-strong)]" : "text-fg/[0.14]"
      }`}
    >
      {line.map((w, i) => (
        <span key={i} className="flex items-center gap-[0.5em]">
          {w}
          <span className="inline-block size-[0.14em] bg-fg" />
        </span>
      ))}
    </div>
  );
}

// Two rows of type that slide against each other with the scroll. It sits behind
// the figure, so the model crosses in front of it on the way to the work section.
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 };
      gsap.fromTo("[data-row='a']", { xPercent: 0 }, { xPercent: -28, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-row='b']", { xPercent: -30 }, { xPercent: -2, ease: "none", scrollTrigger: st });

      // the type leans into fast scrolling and straightens when it stops
      const skew = gsap.quickTo("[data-skew]", "skewX", { duration: 0.5, ease: "power3" });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => skew(gsap.utils.clamp(-14, 14, self.getVelocity() / -250)),
        onLeave: () => skew(0),
        onLeaveBack: () => skew(0),
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="relative z-0 overflow-hidden py-16 select-none md:py-24">
      <div data-skew>
        <div data-row="a">
          <Row words={TOP} />
        </div>
        <div data-row="b">
          <Row words={BOTTOM} outline />
        </div>
      </div>
    </div>
  );
}
