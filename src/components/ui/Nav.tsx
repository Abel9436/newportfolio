"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { useIntro } from "../providers/Intro";
import { useTheme } from "../providers/Theme";

export const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "training", label: "AI training" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact" },
];

export function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: profile.timeZone,
      hour: "2-digit",
      minute: "2-digit",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 15000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time || "--:--"}</span>;
}

function ThemeSwitch() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      data-nav-item
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      className="label group flex items-center gap-2 text-white"
    >
      {/* half-filled disc; it turns over when the theme does */}
      <span className="relative size-3 overflow-hidden rounded-full border border-white">
        <span
          className={`absolute inset-y-0 left-0 w-1/2 bg-white transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${
            theme === "light" ? "translate-x-full" : ""
          }`}
        />
      </span>
      <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}

export function Nav() {
  const lenis = useLenis();
  const { ready } = useIntro();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    lenis?.scrollTo(`#${id}`, { duration: 1.6 });
  };

  useGSAP(
    () => {
      if (!ready) return;
      gsap.from("[data-nav-item]", { yPercent: -120, duration: 1, ease: "expo.out", stagger: 0.05, delay: 0.3 });
    },
    { dependencies: [ready], scope: root },
  );

  useGSAP(
    () => {
      gsap.to("[data-menu]", {
        clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
        duration: 0.8,
        ease: "expo.inOut",
      });
    },
    { dependencies: [open], scope: root },
  );

  return (
    <div ref={root}>
      <header className="frame fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="cols items-center py-5 md:py-6">
          <div className="col-span-2 overflow-hidden md:col-span-1">
            <button data-nav-item onClick={() => go("top")} className="label flex items-center gap-2 text-white">
              <span className="size-2 bg-white" />
              Abel Bekele
            </button>
          </div>

          <nav className="col-span-3 hidden overflow-hidden md:block" aria-label="Sections">
            <ul className="flex gap-6">
              {SECTIONS.map((s) => (
                <li key={s.id} data-nav-item>
                  <button
                    onClick={() => go(s.id)}
                    className="label link-line text-white/70 transition-colors hover:text-white"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 flex items-center justify-end gap-6 overflow-hidden">
            <span data-nav-item className="label hidden text-white/60 lg:block">
              Ethiopia <LocalTime />
            </span>
            <ThemeSwitch />
            <a
              data-nav-item
              href={profile.resume}
              target="_blank"
              className="label link-line hidden text-white md:block"
            >
              Resume
            </a>
            <button
              data-nav-item
              onClick={() => setOpen((v) => !v)}
              className="label text-white md:hidden"
              aria-expanded={open}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div
        data-menu
        className="fixed inset-x-0 top-0 z-40 bg-fg text-bg md:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <ul className="frame flex flex-col gap-1 pb-8 pt-20">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button onClick={() => go(s.id)} className="display flex items-baseline gap-3 py-2 text-3xl">
                <span className="label text-bg/50">0{i + 1}</span>
                {s.label}
              </button>
            </li>
          ))}
          <li className="mt-6">
            <a href={profile.resume} target="_blank" className="label">
              Download resume
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
