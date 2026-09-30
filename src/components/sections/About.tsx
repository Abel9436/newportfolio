import { stats } from "@/content/profile";
import { Kinetic, Rise } from "../ui/Kinetic";
import { SectionLabel } from "../ui/SectionLabel";

export function About() {
  return (
    <section
      id="profile"
      data-stage="about"
      className="frame relative z-[2] flex min-h-svh flex-col justify-center py-28 md:py-40"
    >
      <div className="cols">
        <div className="col-span-4 md:col-span-3 md:col-start-4">
          <SectionLabel index="01" title="Profile" />
          <Kinetic as="h2" className="display mt-8 text-[clamp(2.2rem,4.4vw,4.8rem)] leading-[1.04] text-balance">
            I build things end to end.
          </Kinetic>
          <Rise as="p" className="mt-8 max-w-[40ch] text-[18px] leading-relaxed text-muted md:text-[21px]">
            Five years of writing Python, across freelance, contract and founder work. These days that means AI systems,
            automation, and training the models themselves.
          </Rise>

          <dl className="mt-16 grid grid-cols-2 border-t border-line-strong md:mt-24">
            {stats.map((s, i) => (
              <Rise key={s.value} delay={i * 0.08} className="py-6 pr-4 md:py-8">
                <dt className="display text-[clamp(2.4rem,4.2vw,4.6rem)] leading-none tracking-[-0.04em]">{s.value}</dt>
                <dd className="label mt-4 text-muted">{s.label}</dd>
              </Rise>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
