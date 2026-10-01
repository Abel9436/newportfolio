import { education, languages, recognition, skills } from "@/content/profile";
import { Kinetic, Rise } from "../ui/Kinetic";
import { SectionLabel } from "../ui/SectionLabel";

export function Toolkit() {
  return (
    <section id="toolkit" data-stage="skills" className="frame relative z-[2] py-28 md:py-40">
      <div className="cols gap-y-16">
        <div className="col-span-4 md:col-start-3">
          <SectionLabel index="06" title="Toolkit" />
          <Kinetic as="h2" className="display mt-8 max-w-[20ch] text-[clamp(2rem,4vw,4.4rem)] leading-[1.06]">
            Python first, for almost everything.
          </Kinetic>

          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line-strong pt-8 md:grid-cols-4">
            {skills.map((g, i) => (
              <Rise key={g.group} delay={i * 0.06}>
                <h3 className="label text-muted">{g.group}</h3>
                <ul className="mt-4 space-y-2 text-[17px] text-fg/85">
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Rise>
            ))}
          </div>
        </div>

        <div className="col-span-4 grid gap-10 md:col-start-3 md:grid-cols-2 md:gap-6">
          <Rise className="border-t border-line-strong pt-8">
            <h3 className="label text-muted">Education</h3>
            <p className="display mt-5 text-[clamp(1rem,1.35vw,1.35rem)] leading-snug">{education.degree}</p>
            <p className="mt-2 text-[14px] text-muted">
              {education.school}, {education.period}
            </p>
            <p className="label mt-4 text-fg">{education.note}</p>

            <h3 className="label mt-10 text-muted">Languages</h3>
            <ul className="mt-4 space-y-2 text-[17px] text-fg/85">
              {languages.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </Rise>

          <Rise delay={0.08} className="border-t border-line-strong pt-8">
            <h3 className="label text-muted">Recognition</h3>
            <ul className="mt-3">
              {recognition.map((r) => (
                <li key={r.title} className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
                  <span>
                    <span className="text-[15px] font-medium">{r.title}</span>
                    <span className="mt-0.5 block text-[13px] text-muted">{r.detail}</span>
                  </span>
                  <span className="label text-faint">{r.year}</span>
                </li>
              ))}
            </ul>
          </Rise>
        </div>
      </div>
    </section>
  );
}
