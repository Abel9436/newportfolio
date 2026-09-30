// Delivers the footer form to Abel's inbox through Resend (https://resend.com).
// Needs RESEND_API_KEY. Without it the route answers 503 and the form falls back
// to opening the visitor's mail app with the message already written.

const TOPICS = ["A project", "A role", "Just saying hi"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Small in-memory limiter: plenty for a portfolio, resets with the server.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const name = String(body.name ?? "")
    .trim()
    .slice(0, 80);
  const email = String(body.email ?? "")
    .trim()
    .slice(0, 120);
  const message = String(body.message ?? "")
    .trim()
    .slice(0, 4000);
  const topic = TOPICS.find((t) => t === body.topic) ?? TOPICS[0];

  // Honeypot: people never see this field, bots fill it in.
  if (String(body.website ?? "")) return Response.json({ ok: true });

  if (!name || !EMAIL.test(email) || message.length < 10) {
    return Response.json({ error: "invalid" }, { status: 422 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return Response.json({ error: "slow-down" }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "not-configured" }, { status: 503 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL ?? "abelbk06@gmail.com"],
      reply_to: email,
      subject: `${topic}, from ${name}`,
      text: `${message}\n\n${name}\n${email}`,
    }),
  });

  if (!res.ok) return Response.json({ error: "send-failed" }, { status: 502 });
  return Response.json({ ok: true });
}
