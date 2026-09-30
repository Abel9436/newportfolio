"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import { useIntro } from "../providers/Intro";

type TagName = "div" | "p" | "h2" | "h3" | "li" | "span";

type Props = {
  as?: TagName;
  children: React.ReactNode;
  className?: string;
  /** split unit; each piece rises out of its own mask */
  by?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  /** play right after the preloader instead of on scroll */
  onIntro?: boolean;
  id?: string;
};

export function Kinetic({
  as = "div",
  children,
  className,
  by = "lines",
  delay = 0,
  stagger = 0.08,
  onIntro = false,
  id,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // One concrete tag for typing; the rendered element is whatever `as` says.
  const Tag = as as "div";
  const { ready } = useIntro();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready) return;
      const split = SplitText.create(el, {
        type: by === "chars" ? "words,chars" : by,
        mask: by,
        linesClass: "k-line",
        wordsClass: "k-word",
        charsClass: "k-char",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          return gsap.from(self[by], {
            yPercent: 110,
            duration: 1.15,
            ease: "expo.out",
            stagger,
            delay,
            scrollTrigger: onIntro ? undefined : { trigger: el, start: "top 88%", once: true },
          });
        },
      });
      return () => split.revert();
    },
    { dependencies: [ready], scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}

/** Fades and lifts a block when it scrolls into view. */
export function Rise({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: TagName;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // One concrete tag for typing; the rendered element is whatever `as` says.
  const Tag = as as "div";
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: "expo.out",
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        },
      );
    },
    { dependencies: [ready], scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}
