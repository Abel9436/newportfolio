"use client";

import { useGSAP } from "@gsap/react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useIntro } from "../providers/Intro";

const MIN_MS = 1400;
const GIVE_UP_MS = 12000;

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const { progress } = useProgress();
  const { finish } = useIntro();
  const [loaded, setLoaded] = useState(false);
  const [gone, setGone] = useState(false);
  const shown = useRef({ value: 0 });
  const started = useRef(0);

  useEffect(() => {
    started.current = performance.now();
    // If the model never arrives, let the visitor in anyway.
    const bail = window.setTimeout(() => setLoaded(true), GIVE_UP_MS);
    return () => window.clearTimeout(bail);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const wait = Math.max(0, MIN_MS - (performance.now() - started.current));
    const id = window.setTimeout(() => setLoaded(true), wait);
    return () => window.clearTimeout(id);
  }, [progress]);

  // Count towards the real loading progress, never backwards.
  useGSAP(() => {
    const target = loaded ? 100 : Math.min(progress, 99);
    gsap.to(shown.current, {
      value: target,
      duration: loaded ? 0.5 : 1.2,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        if (counter.current) counter.current.textContent = String(Math.round(shown.current.value)).padStart(3, "0");
      },
    });
  }, [progress, loaded]);

  useGSAP(
    () => {
      if (!loaded) return;
      const tl = gsap.timeline({ delay: 0.55, onComplete: () => setGone(true) });
      tl.to("[data-pre-text]", { yPercent: -110, duration: 0.8, ease: "expo.in", stagger: 0.04 })
        .to(
          "[data-pre-col]",
          { scaleY: 0, duration: 1.1, ease: "expo.inOut", stagger: { each: 0.07, from: "center" } },
          "-=0.2",
        )
        .to(
          "[data-pre-ink]",
          { scaleY: 0, duration: 1.1, ease: "expo.inOut", stagger: { each: 0.07, from: "center" } },
          "<0.12",
        )
        .call(finish, [], "<0.15");
    },
    { dependencies: [loaded], scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100]" role="status" aria-label="Loading">
      <div className="frame absolute inset-0">
        <div className="cols h-full">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`relative h-full ${i >= 4 ? "hidden md:block" : ""}`}>
              <div data-pre-ink className="absolute inset-0 origin-top bg-fg" />
              <div data-pre-col className="absolute inset-0 origin-top border-l border-line bg-bg" />
            </div>
          ))}
        </div>
      </div>
      {/* gutters, so the curtain covers edge to edge */}
      <div data-pre-col className="absolute inset-y-0 left-0 w-[var(--gutter)] origin-top bg-bg" />
      <div data-pre-col className="absolute inset-y-0 right-0 w-[var(--gutter)] origin-top bg-bg" />

      <div className="frame absolute inset-0 flex flex-col justify-between py-6 md:py-8">
        <div className="flex justify-between text-muted">
          <span className="overflow-hidden">
            <span data-pre-text className="label block">
              Abel Bekele
            </span>
          </span>
          <span className="overflow-hidden">
            <span data-pre-text className="label block">
              Portfolio, 2026
            </span>
          </span>
        </div>
        <div className="flex items-end justify-between gap-6">
          <span className="overflow-hidden">
            <span
              ref={counter}
              data-pre-text
              className="display block text-[22vw] leading-none tabular-nums md:text-[13vw]"
            >
              000
            </span>
          </span>
          <span className="overflow-hidden pb-3 text-right text-muted">
            <span data-pre-text className="label block">
              Loading the figure
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
