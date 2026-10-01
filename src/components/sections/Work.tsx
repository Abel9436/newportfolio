"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { projects } from "@/content/profile";
import { useReach } from "../providers/Reach";
import { stage } from "../three/stage";
import { SectionLabel } from "../ui/SectionLabel";

const pad = (n: number) => String(n).padStart(2, "0");

export function Work() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = projects.length;
  const { openContact } = useReach();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      let current = 0;

      gsap.set(q("[data-slide]"), { autoAlpha: 0 });
      gsap.set(q("[data-slide='0']"), { autoAlpha: 1 });
      gsap.set(q("[data-num]"), { yPercent: 100 });
      gsap.set(q("[data-num='0']"), { yPercent: 0 });

      const show = (next: number) => {
        const prev = current;
        if (next === prev) return;
        current = next;
        setActive(next);
        const forward = next > prev;
        const from = forward ? "start" : "end";
        const ink = q("[data-cur-ink]");
        const cover = q("[data-cur-bg]");
        const strips = q("[data-cur]");

        gsap.killTweensOf([...strips, ...q("[data-slide]"), ...q("[data-slide] [data-k]"), ...q("[data-num]")]);
        gsap
          .timeline()
          .set(strips, { transformOrigin: forward ? "50% 100%" : "50% 0%" })
          .to(ink, { scaleY: 1, duration: 0.42, ease: "expo.in", stagger: { each: 0.05, from } })
          .to(cover, { scaleY: 1, duration: 0.42, ease: "expo.in", stagger: { each: 0.05, from } }, "<0.07")
          .set(q("[data-slide]"), { autoAlpha: 0 })
          .set(q(`[data-slide='${next}']`), { autoAlpha: 1 })
          .set(strips, { transformOrigin: forward ? "50% 0%" : "50% 100%" })
          .to(cover, { scaleY: 0, duration: 0.8, ease: "expo.out", stagger: { each: 0.05, from } })
          .to(ink, { scaleY: 0, duration: 0.8, ease: "expo.out", stagger: { each: 0.05, from } }, "<0.08")
          .fromTo(
            q(`[data-slide='${next}'] [data-k]`),
            { yPercent: forward ? 60 : -60, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: "expo.out", stagger: 0.05 },
            "<",
          );

        // the big counter rolls like an odometer
        gsap.to(q(`[data-num='${prev}']`), { yPercent: forward ? -100 : 100, duration: 0.9, ease: "expo.inOut" });
        gsap.fromTo(
          q(`[data-num='${next}']`),
          { yPercent: forward ? 100 : -100 },
          { yPercent: 0, duration: 0.9, ease: "expo.inOut" },
        );
      };

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * count * 0.85}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // one full turn of the figure across the whole carousel
          stage.spin = self.progress * Math.PI * 2;
          show(Math.min(count - 1, Math.floor(self.progress * count)));
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" data-stage="work" className="frame relative z-[2] h-svh overflow-hidden">
      <div className="flex h-full flex-col pb-6 pt-20 md:pb-8 md:pt-24">
        <div className="cols items-start">
          <div className="col-span-2">
            <SectionLabel index="02" title="Selected work" />
          </div>
          <p className="label col-span-2 text-right text-muted md:col-span-1 md:col-start-6">
            2023 — 2026
            <br />
            {count} projects
          </p>
        </div>

        <div className="cols mt-auto flex-1 items-end md:items-center">
          <div className="relative col-span-4 md:col-span-3">
            <div className="grid">
              {projects.map((p, i) => (
                <article key={p.title} data-slide={i} className="col-start-1 row-start-1 pr-4 md:pr-10">
                  <p data-k className="label flex flex-wrap gap-x-3 gap-y-1 text-muted">
                    <span className="text-fg">{pad(i + 1)}</span>
                    <span>/</span>
                    <span>{p.kind}</span>
                    <span>/</span>
                    <span>{p.period}</span>
                    {p.praise && (
                      <>
                        <span>/</span>
                        <span className="text-fg">&#9733; {p.praise}</span>
                      </>
                    )}
                  </p>
                  <h3
                    data-k
                    className="display mt-5 text-[clamp(2.8rem,7vw,7.8rem)] leading-[0.95] text-balance md:mt-7"
                  >
                    {p.title}
                  </h3>
                  <p data-k className="mt-5 max-w-[38ch] text-[17px] leading-relaxed text-muted md:mt-8 md:text-[21px]">
                    {p.summary}
                  </p>
                  <p data-k className="label mt-6 text-fg md:mt-8">
                    {p.points.join("  /  ")}
                  </p>
                  <div data-k className="mt-6 flex flex-wrap items-center gap-2 md:mt-8">
                    {p.tags.map((t) => (
                      <span key={t} className="label rounded-full border border-line-strong px-3 py-1.5 text-muted">
                        {t}
                      </span>
                    ))}
                    {p.href && (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="label group ml-1 inline-flex items-center gap-2 rounded-full border border-fg bg-fg px-4 py-1.5 text-bg transition-colors duration-300 hover:bg-transparent hover:text-fg"
                      >
                        {p.hrefLabel}
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          &#8599;
                        </span>
                      </a>
                    )}
                    <button
                      onClick={() =>
                        openContact({
                          topic: "A project",
                          message: `Hi Abel, I saw ${p.title} and I'm working on something in the same space. `,
                        })
                      }
                      className="label group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-fg"
                    >
                      <span className="link-line">Build something like this</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* the shutter: one strip per grid column, ink first, then paper */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-y-6 inset-x-0 grid grid-cols-4 md:grid-cols-3"
            >
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className={`relative ${i === 3 ? "md:hidden" : ""}`}>
                  <div data-cur data-cur-ink className="absolute inset-0 scale-y-0 bg-fg" />
                  <div data-cur data-cur-bg className="absolute inset-0 scale-y-0 bg-bg" />
                </div>
              ))}
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none col-span-2 col-start-5 hidden self-end justify-self-end overflow-hidden md:block"
          >
            <div className="display grid text-[13vw] leading-[0.85] text-transparent [-webkit-text-stroke:1px_var(--faint)]">
              {projects.map((p, i) => (
                <span key={p.title} data-num={i} className="col-start-1 row-start-1 text-right tabular-nums">
                  {pad(i + 1)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="cols mt-8 items-end md:mt-10">
          <ol className="col-span-4 flex gap-1.5 md:col-span-5 md:gap-6">
            {projects.map((p, i) => (
              <li key={p.title} className="min-w-0 flex-1 md:flex-none">
                <span className="relative block h-px w-full bg-line-strong md:w-28">
                  <span
                    className={`absolute inset-0 origin-left bg-fg transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${
                      i === active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </span>
                <span
                  className={`label mt-3 hidden truncate transition-colors duration-500 md:block ${
                    i === active ? "text-fg" : "text-faint"
                  }`}
                >
                  {p.title}
                </span>
              </li>
            ))}
          </ol>
          <p className="label col-span-4 mt-4 tabular-nums text-muted md:col-span-1 md:mt-0 md:text-right">
            <span className="text-fg">{pad(active + 1)}</span> / {pad(count)}
          </p>
        </div>
      </div>
    </section>
  );
}
