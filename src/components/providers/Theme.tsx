"use client";

import gsap from "gsap";
import { createContext, useCallback, useContext, useMemo, useRef, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

// Hex twins of --bg, for the curtain that has to show the next theme before it applies.
const PAPER: Record<Theme, string> = { dark: "#0a0a0a", light: "#eeede9" };

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

type ThemeState = { theme: Theme; toggle: () => void };
const ThemeContext = createContext<ThemeState>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, read, () => "dark" as Theme);
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const toggle = useCallback(() => {
    const el = curtain.current;
    if (!el || busy.current) return;
    busy.current = true;
    const next: Theme = read() === "dark" ? "light" : "dark";
    const strips = el.querySelectorAll<HTMLElement>("[data-strip]");
    gsap.set(el, { autoAlpha: 1 });
    gsap.set(strips, { backgroundColor: PAPER[next], transformOrigin: "50% 100%", scaleY: 0 });
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(el, { autoAlpha: 0 });
          busy.current = false;
        },
      })
      .to(strips, { scaleY: 1, duration: 0.55, ease: "expo.in", stagger: 0.05 })
      .call(() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {}
      })
      .set(strips, { transformOrigin: "50% 0%" })
      .to(strips, { scaleY: 0, duration: 0.8, ease: "expo.out", stagger: 0.05 }, "+=0.08");
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {/* strips follow the page columns; the two gutters close with the outer columns */}
      <div ref={curtain} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[95]">
        <div data-strip className="absolute inset-y-0 left-0 w-[var(--gutter)]" />
        <div data-strip className="absolute inset-y-0 right-0 w-[var(--gutter)]" />
        <div className="frame h-full">
          <div className="cols h-full">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} data-strip className={`h-full ${i >= 4 ? "hidden md:block" : ""}`} />
            ))}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
