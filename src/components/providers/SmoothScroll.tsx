"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";
import { stage } from "../three/stage";
import { useIntro } from "./Intro";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Holds the page still until the preloader clears.
function ScrollGate() {
  const lenis = useLenis(() => ScrollTrigger.update());
  const { ready } = useIntro();

  useEffect(() => {
    if (!lenis) return;
    if (ready) {
      lenis.start();
      ScrollTrigger.refresh();
    } else lenis.stop();
  }, [lenis, ready]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const tick = (time: number) => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      lenis.raf(time * 1000);
      stage.velocity = lenis.velocity;
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.09, wheelMultiplier: 0.9 }}>
      <ScrollGate />
      {children}
    </ReactLenis>
  );
}
