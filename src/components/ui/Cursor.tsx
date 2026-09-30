"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

// A small dot that inverts whatever it sits on and swells over anything clickable.
// Mouse and trackpad only; touch screens keep their native behaviour.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = dot.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
    };
    const over = (e: PointerEvent) => {
      const hot = (e.target as Element | null)?.closest("a, button");
      gsap.to(el, { scale: hot ? 4.2 : 1, duration: 0.45, ease: "power3.out" });
    };
    const leave = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  });

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none invisible fixed left-0 top-0 z-[99] size-2.5 rounded-full bg-white mix-blend-difference"
    />
  );
}

export function Grain() {
  return <div aria-hidden className="grain pointer-events-none fixed -inset-[10%] z-[60]" />;
}
