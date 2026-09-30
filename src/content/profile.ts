export const profile = {
  name: "Abel Bekele",
  role: "AI Engineer",
  location: "Ethiopia",
  timeZone: "Africa/Addis_Ababa",
  email: "abelbk06@gmail.com",
  phone: "+251 984 981 703",
  phoneHref: "tel:+251984981703",
  resume: "/abel-bekele-resume.pdf",
  links: [
    { label: "GitHub", href: "https://github.com/Abel9436" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abelabekele" },
    { label: "abelo.tech", href: "https://abelo.tech/" },
  ],
};

// What I do, as the experience section says it.
export const disciplines = ["AI Engineer", "Automation Expert", "AI Trainer"];

export const stats = [
  { value: "5+", label: "Years of Python" },
  { value: "1.5k", label: "Learners on Skillneta" },
  { value: "300+", label: "Problems solved at A2SV" },
  { value: "1st", label: "CSEC-ASTU Hackathon" },
];

export type Project = {
  title: string;
  kind: string;
  period: string;
  summary: string;
  points: string[];
  tags: string[];
  href?: string;
  hrefLabel?: string;
};

export const projects: Project[] = [
  {
    title: "SebeVerify",
    kind: "Identity verification",
    period: "2025 — 26",
    summary: "Scan a Fayda ID or passport, match the face, make sure a real person is holding the phone.",
    points: ["OCR", "Face match", "Liveness"],
    tags: ["Python", "Computer vision"],
  },
  {
    title: "PySQLEngine",
    kind: "Database engine",
    period: "2026",
    summary: "A SQL database in pure Python. Parser, optimizer, indexes, all of it written by hand.",
    points: ["B+Tree indexes", "MVCC", "WAL recovery"],
    tags: ["Python", "Systems"],
    href: "https://github.com/Abel9436/PySQLEngine",
    hrefLabel: "Source",
  },
  {
    title: "Skillneta",
    kind: "Course platform",
    period: "2024",
    summary: "One codebase, five tenants, 1,500 learners. I built it and ran it as a founder.",
    points: ["Multi-tenant", "Type-safe", "Docker"],
    tags: ["Next.js", "Django"],
    href: "https://skillneta.com/",
    hrefLabel: "Visit",
  },
  {
    title: "Transit Delays",
    kind: "Data pipeline",
    period: "2025 — 26",
    summary: "15,000 messy transit records, cleaned up and turned into a dashboard of which routes run late, and when.",
    points: ["pandas", "dbt layers", "Plotly"],
    tags: ["Data", "Analytics"],
  },
  {
    title: "Social Guard",
    kind: "Android app",
    period: "2025",
    summary: "Tracks which apps you open and holds you to the limits you set.",
    points: ["Usage tracking", "Limits", "Background services"],
    tags: ["Flutter", "Android"],
  },
];

export type Role = {
  company: string;
  title: string;
  period: string;
  note: string;
  /** indexes into `disciplines` */
  tracks: number[];
};

export const experience: Role[] = [
  {
    company: "AfterQuery",
    title: "AI Trainer, RLHF",
    period: "2026 — Now",
    note: "RLHF, SWE-Bench and Terminal-Bench style tasks, and long-horizon work for coding agents.",
    tracks: [2],
  },
  {
    company: "Turing",
    title: "AI Engineer, Code Evaluation",
    period: "2026",
    note: "Ran five Python services and cut their response times in half. Reviewed 500+ code samples.",
    tracks: [0, 2],
  },
  {
    company: "Revelo",
    title: "AI Trainer, RLHF",
    period: "2025 — 26",
    note: "RLHF and code evaluation for Python and TypeScript models.",
    tracks: [2],
  },
  {
    company: "A2SV",
    title: "Engineering Fellow",
    period: "2024 — 25",
    note: "300+ algorithm problems, and a lot of code review with peers.",
    tracks: [0],
  },
  {
    company: "Ethronics",
    title: "Python Developer, Intern",
    period: "2024",
    note: "Led five engineers and shipped two weeks early. Designed a 50-endpoint FastAPI service.",
    tracks: [0],
  },
  {
    company: "Abel Automations",
    title: "Automation Expert, Founder",
    period: "2023 — 24",
    note: "Built Skillneta end to end. Automations that took 40% off client ops work.",
    tracks: [1, 0],
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "Dart", "C++"] },
  { group: "AI & automation", items: ["LangChain", "LangGraph", "AI agents", "Computer vision", "n8n"] },
  { group: "Backend & data", items: ["FastAPI", "Django", "Node.js", "PostgreSQL", "dbt", "pandas"] },
  { group: "Product & delivery", items: ["Next.js", "React", "Flutter", "Docker", "CI/CD", "pytest"] },
];

// The terminal in the AI training section. One tab per kind of work; the output is
// my experience with it, told in first person.
export type Session = { id: string; name: string; note: string; prompt: string; lines: string[] };

export const training: Session[] = [
  {
    id: "rlhf",
    name: "RLHF",
    note: "AfterQuery, Revelo, Turing",
    prompt: "cat ~/experience/rlhf.md",
    lines: [
      "I compare model answers side by side and pick the better one",
      "every pick comes with a written reason, line by line",
      "Python and TypeScript; 500+ code samples reviewed at Turing",
      "the goal: models that write code people can trust",
    ],
  },
  {
    id: "swe-bench",
    name: "SWE-Bench",
    note: "real repositories, real issues",
    prompt: "cat ~/experience/swe-bench.md",
    lines: [
      "I work from real issues in real codebases, not toy problems",
      "reproduce the bug first, then write the patch",
      "the tests decide: failing before, passing after",
      "it teaches agents to fix code the way engineers do",
    ],
  },
  {
    id: "terminal-bench",
    name: "Terminal-Bench",
    note: "tasks an agent must finish in a real shell",
    prompt: "cat ~/experience/terminal-bench.md",
    lines: [
      "I design tasks an agent has to solve with nothing but a terminal",
      "each one ships with a working solution and the tests that grade it",
      "I check it fails before the fix and passes after",
      "then tune it until strong models still have to think",
    ],
  },
  {
    id: "long-horizon",
    name: "Long horizon",
    note: "work that doesn't fit in one step",
    prompt: "cat ~/experience/long-horizon.md",
    lines: [
      "I build tasks with many connected fixes, not one-liners",
      "one wrong move early quietly breaks everything later",
      "the agent has to plan, check each step, and keep going",
      "it's where you find out if a model can really finish a job",
    ],
  },
  {
    id: "langgraph",
    name: "LangChain / LangGraph",
    note: "the building side",
    prompt: "cat ~/experience/langgraph.md",
    lines: [
      "I wire models into real products, in Python",
      "agents as graphs: plan, call tools, review",
      "LangChain for the tools, LangGraph for the flow",
      "FastAPI underneath, same as the rest of my backends",
    ],
  },
  {
    id: "hire",
    name: "Hire me",
    note: "you've read this far, so",
    prompt: "abel --available",
    lines: [
      "open to AI engineering, automation and AI training work",
      "already working remotely with teams abroad",
      "one message away",
    ],
  },
];

export const education = {
  degree: "B.Sc. Computer Science and Engineering",
  school: "Adama Science and Technology University",
  period: "2022 — 2026",
  note: "CGPA 3.5 / 4.0",
};

export const recognition = [
  { title: "1st Place", detail: "CSEC-ASTU Hackathon", year: "2026" },
  { title: "Top 4 Project", detail: "ASTU Best Projects", year: "2026" },
  { title: "Mentor", detail: "AGT Hackathon", year: "" },
  { title: "Competitive programmer", detail: "LeetCode and Codeforces", year: "" },
];

export const languages = ["English, professional", "Amharic, native"];
