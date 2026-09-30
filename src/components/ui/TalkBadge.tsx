"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useIntro } from "../providers/Intro";
import { useReach } from "../providers/Reach";
import { Magnetic } from "./Magnetic";

// A plain, solid "Let's talk" pill that keeps the door open the whole way down.
// Printed in reverse so it stands out in either theme, and it steps aside at the contact form.
export function TalkBadge() {
  const root = useRef<HTMLDivElement>(null);
  const { ready } = useIntro();
  const { openContact } = useReach();

  useGSAP(
    () => {
      if (!ready) return;
      let pastHero = false;
      let atContact = false;
      const show = () => {
        const on = pastHero && !atContact;
        gsap.to(root.current, {
          autoAlpha: on ? 1 : 0,
          y: on ? 0 : 24,
          duration: 0.6,
          ease: on ? "expo.out" : "power3.in",
          overwrite: true,
        });
      };

      // page-level sections live outside this component, so look them up on the document
      ScrollTrigger.create({
        trigger: document.getElementById("profile"),
        start: "top 80%",
        end: "max",
        onToggle: (self) => {
          pastHero = self.isActive || self.progress > 0;
          show();
        },
      });
      ScrollTrigger.create({
        trigger: document.getElementById("contact"),
        start: "top 70%",
        end: "max",
        onToggle: (self) => {
          atContact = self.isActive;
          show();
        },
      });
    },
    { dependencies: [ready], scope: root },
  );

  return (
    <div
      ref={root}
      className="invisible fixed bottom-5 right-[var(--gutter)] z-50 md:bottom-8 md:right-[calc(var(--gutter)+28px)]"
    >
      <Magnetic strength={0.25}>
        <button
          onClick={() => openContact()}
          className="group flex items-center gap-3 rounded-full bg-fg py-2 pl-4 pr-2 text-bg shadow-[0_10px_40px_-10px_rgb(0_0_0/0.5)] transition-transform duration-300 hover:scale-[1.04] md:py-2.5 md:pl-5"
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-bg opacity-60" />
            <span className="relative size-2 rounded-full bg-bg" />
          </span>
          <span className="flex flex-col items-start text-left leading-tight">
            <span className="text-[15px] font-medium md:text-[16px]">Let&apos;s talk</span>
            <span className="label hidden text-bg/60 md:block">Open to work</span>
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-bg text-fg transition-transform duration-500 group-hover:rotate-45 md:size-10">
            &#8599;
          </span>
        </button>
      </Magnetic>
    </div>
  );
}
