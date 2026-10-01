"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { testimonials } from "@/content/profile";
import { useIntro } from "../providers/Intro";
import { useReach } from "../providers/Reach";
import { Kinetic, Rise } from "../ui/Kinetic";
import { SectionLabel } from "../ui/SectionLabel";

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          data-star
          aria-hidden
          className={`text-[18px] leading-none md:text-[22px] ${i < count ? "text-fg" : "text-faint"}`}
        >
          &#9733;
        </span>
      ))}
    </span>
  );
}

// Clients in their own words. Short on purpose: these are what they actually said.
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();
  const { openContact } = useReach();

  useGSAP(
    () => {
      if (!ready) return;
      gsap.utils.toArray<HTMLElement>("[data-quote]").forEach((q) => {
        gsap.from(q.querySelectorAll("[data-star]"), {
          scale: 0,
          rotation: -90,
          duration: 0.7,
          ease: "back.out(2)",
          stagger: 0.08,
          scrollTrigger: { trigger: q, start: "top 80%", once: true },
        });
        gsap.from(q.querySelector("[data-mark]"), {
          yPercent: 40,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: q, start: "top 85%", once: true },
        });
      });
    },
    { dependencies: [ready], scope: root },
  );

  return (
    <section ref={root} id="words" data-stage="words" className="frame relative z-[2] py-28 md:py-40">
      <div className="cols">
        <div className="col-span-4 md:col-span-4 md:col-start-3">
          <SectionLabel index="03" title="Kind words" />
        </div>
      </div>

      <div className="cols mt-12 md:mt-16">
        <ul className="col-span-4 md:col-span-4 md:col-start-3">
          {testimonials.map((t, i) => (
            <li key={t.name} data-quote className={`relative ${i > 0 ? "mt-20 md:mt-28" : ""}`}>
              <span
                data-mark
                aria-hidden
                className="display pointer-events-none absolute -left-1 -top-[0.42em] select-none text-[clamp(5rem,11vw,11rem)] leading-none text-faint md:-left-[0.55em]"
              >
                &ldquo;
              </span>
              <blockquote className="relative">
                <Kinetic
                  as="p"
                  by="words"
                  stagger={0.06}
                  className="display text-[clamp(2.2rem,5.4vw,6rem)] leading-[1.02] text-balance"
                >
                  {t.quote}
                </Kinetic>
              </blockquote>
              <Rise className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
                {t.rating ? <Stars count={t.rating} /> : null}
                <p className="text-[17px] md:text-[19px]">
                  {t.name}
                  <span className="text-muted">, {t.role}</span>
                </p>
                <p className="label text-muted">{t.project}</p>
              </Rise>
            </li>
          ))}
        </ul>
      </div>

      <div className="cols mt-20 md:mt-28">
        <Rise className="col-span-4 md:col-span-4 md:col-start-3">
          <button
            onClick={() => openContact({ topic: "A project" })}
            className="label group inline-flex items-center gap-3 text-left text-fg"
          >
            <span className="link-line">Want to be the next one? Start a project</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
          </button>
        </Rise>
      </div>
    </section>
  );
}
