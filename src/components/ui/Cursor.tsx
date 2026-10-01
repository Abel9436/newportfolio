"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

// A small dot that inverts whatever it sits on. It swells over anything clickable and
// grows into a labelled disc over anything with data-cursor="Word" (the hero says "Drag").
// Mouse and trackpad only; touch screens keep their native behaviour.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

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
      const target = e.target as Element | null;
      const hot = target?.closest("a, button, input, textarea");
      const tagged = hot ? null : target?.closest<HTMLElement>("[data-cursor]");
      const word = tagged?.dataset.cursor ?? "";
      setLabel(word);
      const size = word ? 84 : hot ? 44 : 10;
      gsap.to(el, { width: size, height: size, duration: 0.45, ease: "power3.out" });
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
      className="pointer-events-none invisible fixed left-0 top-0 z-[99] grid size-2.5 place-items-center rounded-full bg-white mix-blend-difference"
    >
      <span
        className={`label text-[10px] text-black transition-opacity duration-300 ${label ? "opacity-100" : "opacity-0"}`}
      >
        {label}
      </span>
    </div>
  );
}

export function Grain() {
  return <div aria-hidden className="grain pointer-events-none fixed -inset-[10%] z-[60]" />;
}
