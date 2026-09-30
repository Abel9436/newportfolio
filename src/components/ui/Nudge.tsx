"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useReach, visit } from "../providers/Reach";

const MIN_TIME_MS = 12000;
const MOBILE_DEPTH = 0.62;

// One gentle "before you go" per visit: when a mouse heads for the tab bar, or when a
// phone has scrolled most of the way down. Never after a message has been sent.
export function Nudge() {
  const card = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { openContact } = useReach();

  useEffect(() => {
    if (visit.get("nudged") || visit.get("contacted")) return;
    const started = Date.now();

    const nearContact = () => {
      const form = document.getElementById("contact");
      return !!form && form.getBoundingClientRect().top < window.innerHeight;
    };
    const fire = () => {
      if (Date.now() - started < MIN_TIME_MS || visit.get("nudged") || visit.get("contacted") || nearContact()) return;
      visit.set("nudged");
      setOpen(true);
      detach();
    };

    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) fire();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > MOBILE_DEPTH) fire();
    };
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const detach = () => {
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("scroll", onScroll);
    };

    if (coarse) window.addEventListener("scroll", onScroll, { passive: true });
    else document.addEventListener("mouseout", onLeave);
    return detach;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useGSAP(
    () => {
      if (!open) return;
      gsap
        .timeline()
        .fromTo(
          card.current,
          { clipPath: "inset(100% 0% 0% 0% round 20px)", y: 30 },
          { clipPath: "inset(0% 0% 0% 0% round 20px)", y: 0, duration: 0.9, ease: "expo.out" },
        )
        .from("[data-nudge] > *", { y: 16, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }, 0.2);
    },
    { dependencies: [open], scope: card },
  );

  if (!open) return null;

  const write = () => {
    setOpen(false);
    openContact();
  };

  return (
    <div
      ref={card}
      role="dialog"
      aria-label="Before you go"
      className="fixed bottom-5 left-[var(--gutter)] z-[80] w-[min(400px,calc(100vw-2*var(--gutter)))] rounded-[20px] bg-fg p-6 text-bg shadow-2xl md:bottom-8 md:p-7"
    >
      <div data-nudge>
        <div className="flex items-start justify-between gap-4">
          <p className="label text-bg/60">Before you go</p>
          <button onClick={() => setOpen(false)} aria-label="Close" className="label -mt-1 text-bg/60 hover:text-bg">
            Close
          </button>
        </div>
        <p className="display mt-4 text-[clamp(1.4rem,2vw,1.9rem)] leading-[1.1]">Got something to build?</p>
        <p className="mt-3 text-[15px] leading-relaxed text-bg/70">
          A few lines is enough. I read every message myself.
        </p>
        <div className="mt-6 flex items-center gap-5">
          <button
            onClick={write}
            className="label rounded-full bg-bg px-5 py-3 text-fg transition-transform duration-300 hover:scale-[1.04]"
          >
            Write to Abel
          </button>
          <button onClick={() => setOpen(false)} className="label link-line text-bg/60">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
