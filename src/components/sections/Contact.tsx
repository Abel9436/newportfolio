"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useRef } from "react";
import { profile } from "@/content/profile";
import { ContactForm } from "../ui/ContactForm";
import { Kinetic, Rise } from "../ui/Kinetic";
import { Magnetic } from "../ui/Magnetic";
import { LocalTime } from "../ui/Nav";
import { SectionLabel } from "../ui/SectionLabel";

export function Contact() {
  const lenis = useLenis();
  const root = useRef<HTMLElement>(null);

  // The name rises out of the bottom edge as the page runs out.
  useGSAP(
    () => {
      gsap.fromTo(
        "[data-wordmark]",
        { yPercent: 60 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-wordmark-frame]", start: "top bottom", end: "max", scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" data-stage="contact" className="frame relative overflow-hidden pt-28 md:pt-36">
      <div className="cols relative z-[2]">
        <div className="col-span-4 md:col-span-2">
          <SectionLabel index="06" title="Contact" />
        </div>
      </div>

      {/* behind the figure, like the name in the hero */}
      <Kinetic
        as="h2"
        by="chars"
        stagger={0.03}
        className="display pointer-events-none relative z-0 mt-10 text-[11.5vw] leading-[1.12] select-none md:mt-12 md:text-[8.6vw]"
      >
        Let&apos;s build
        <br />
        <span className="outline-text">something.</span>
      </Kinetic>

      <div className="cols relative z-[2] mt-16 md:mt-24">
        <Rise className="col-span-4">
          <ContactForm />
        </Rise>
      </div>

      <footer className="relative z-[2] mt-28 border-t border-line-strong md:mt-40">
        <div className="cols gap-y-8 py-8 md:py-10">
          <div className="col-span-4 md:col-span-2">
            <p className="label text-muted">Or directly</p>
            <a
              href={`mailto:${profile.email}`}
              className="link-line mt-3 inline-block text-[clamp(1.1rem,1.6vw,1.5rem)] font-medium tracking-[-0.02em]"
            >
              {profile.email}
            </a>
            <a href={profile.phoneHref} className="link-line mt-1 block w-fit text-[14px] text-muted">
              {profile.phone}
            </a>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="label text-muted">Elsewhere</p>
            <ul className="mt-3 space-y-1.5 text-[15px]">
              {profile.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="link-line">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.resume} target="_blank" className="link-line">
                  Resume
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="label text-muted">Local time</p>
            <p className="mt-3 text-[15px]">
              Ethiopia, <LocalTime /> <span className="text-muted">GMT+3</span>
            </p>
          </div>
          <div className="col-span-4 flex items-end justify-between md:col-span-2 md:flex-col md:items-end">
            <p className="label text-faint">&copy; 2026 {profile.name}</p>
            <Magnetic>
              <button
                onClick={() => lenis?.scrollTo(0, { duration: 2.4 })}
                className="label group flex items-center gap-3 text-muted transition-colors hover:text-fg"
              >
                Back to top
                <span className="grid size-10 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-fg">
                  &#8593;
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </footer>

      <div
        data-wordmark-frame
        aria-hidden
        className="pointer-events-none relative z-0 select-none overflow-hidden pb-[1vw]"
      >
        <p data-wordmark className="display whitespace-nowrap text-center text-[8.6vw] leading-[0.9] text-fg">
          ABEL BEKELE
        </p>
      </div>
    </section>
  );
}
