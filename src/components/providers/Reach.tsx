"use client";

import { useLenis } from "lenis/react";
import { createContext, useCallback, useContext, useMemo, useRef } from "react";

export const TOPICS = ["A project", "A role", "Just saying hi"] as const;
export type Topic = (typeof TOPICS)[number];
export type Draft = { topic?: Topic; message?: string };

type Reach = {
  /** scroll to the form and hand it a head start */
  openContact: (draft?: Draft) => void;
  /** the form registers how to apply a draft; returns an unregister function */
  register: (apply: (draft: Draft) => void) => () => void;
};

const ReachContext = createContext<Reach>({ openContact: () => {}, register: () => () => {} });

// Every "talk to me" moment on the page goes through here, so wherever a visitor
// decides to reach out, they land on a form that already knows why.
export function ReachProvider({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const apply = useRef<((draft: Draft) => void) | null>(null);

  const openContact = useCallback(
    (draft: Draft = {}) => {
      apply.current?.(draft);
      const form = document.getElementById("contact-form");
      if (!form) return;
      if (lenis) lenis.scrollTo(form, { offset: -140, duration: 1.8 });
      else form.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [lenis],
  );

  const register = useCallback((fn: (draft: Draft) => void) => {
    apply.current = fn;
    return () => {
      if (apply.current === fn) apply.current = null;
    };
  }, []);

  const value = useMemo(() => ({ openContact, register }), [openContact, register]);
  return <ReachContext.Provider value={value}>{children}</ReachContext.Provider>;
}

export const useReach = () => useContext(ReachContext);

// Remembered for the visit only, so the nudge never shows twice or after a message is sent.
export const visit = {
  get(key: string) {
    try {
      return sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  },
  set(key: string) {
    try {
      sessionStorage.setItem(key, "1");
    } catch {}
  },
};
