"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { TOPICS, useReach, visit, type Topic } from "../providers/Reach";
import { Magnetic } from "./Magnetic";

type Status = "idle" | "sending" | "sent" | "mail-app" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// An input that grows with what is typed, so the sentence keeps reading as a sentence.
function Blank({
  value,
  onChange,
  placeholder,
  type = "text",
  label,
  autoComplete,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  label: string;
  autoComplete: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <input
      ref={inputRef}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      autoComplete={autoComplete}
      required
      style={{ width: `${Math.max(value.length, placeholder.length) + 1.5}ch` }}
      className="mx-1 inline-block max-w-full border-b border-line-strong bg-transparent px-1 text-fg outline-none transition-colors placeholder:text-faint focus:border-fg"
    />
  );
}

export function ContactForm() {
  const root = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const nameInput = useRef<HTMLInputElement>(null);
  const { register } = useReach();

  // Buttons elsewhere on the page can start the message for the visitor.
  useEffect(
    () =>
      register((draft) => {
        if (draft.topic) setTopic(draft.topic);
        if (draft.message !== undefined) setMessage(draft.message);
        setStatus((s) => (s === "sending" ? s : "idle"));
        window.setTimeout(() => nameInput.current?.focus({ preventScroll: true }), 1600);
      }),
    [register],
  );

  const valid = name.trim().length > 0 && EMAIL.test(email.trim()) && message.trim().length >= 10;
  const done = status === "sent" || status === "mail-app";

  useGSAP(
    () => {
      if (!done) return;
      gsap.from("[data-done] > *", { yPercent: 60, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08 });
    },
    { dependencies: [done], scope: root },
  );

  const openMailApp = () => {
    const subject = encodeURIComponent(`${topic}, from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n${name.trim()}\n${email.trim()}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message, website }),
      });
      if (res.ok) {
        visit.set("contacted");
        return setStatus("sent");
      }
      if (res.status === 503) {
        openMailApp();
        visit.set("contacted");
        return setStatus("mail-app");
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setMessage("");
    setStatus("idle");
  };

  return (
    <div ref={root} id="contact-form" className="scroll-mt-32">
      {done ? (
        <div data-done className="max-w-[40rem]" aria-live="polite">
          <p className="display text-[clamp(1.4rem,2.6vw,2.6rem)] leading-[1.15]">
            {status === "sent" ? `Got it, ${name.trim()}.` : "Almost there."}
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            {status === "sent"
              ? `I'll write back to ${email.trim()}.`
              : `Your mail app should be open with the message ready. If it isn't, write to ${profile.email}.`}
          </p>
          <button type="button" onClick={reset} className="label link-line mt-8 text-fg">
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="max-w-[48rem]">
          <p className="display text-[clamp(1.15rem,2.1vw,2.1rem)] leading-[1.8]">
            Hi Abel, I&apos;m
            <Blank
              inputRef={nameInput}
              value={name}
              onChange={setName}
              placeholder="your name"
              label="Your name"
              autoComplete="name"
            />
            and I&apos;d like to talk about
          </p>

          <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Topic">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={topic === t}
                onClick={() => setTopic(t)}
                className={`label rounded-full border px-4 py-2 transition-colors duration-300 ${
                  topic === t
                    ? "border-fg bg-fg text-bg"
                    : "border-line-strong text-muted hover:border-fg hover:text-fg"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <p className="display mt-6 text-[clamp(1.15rem,2.1vw,2.1rem)] leading-[1.8]">
            You can reach me at
            <Blank
              value={email}
              onChange={setEmail}
              placeholder="you@email.com"
              type="email"
              label="Your email"
              autoComplete="email"
            />
          </p>

          <label className="mt-8 block">
            <span className="label text-muted">The details</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="A few lines is plenty."
              rows={3}
              required
              className="mt-3 block w-full resize-none border-b border-line-strong bg-transparent pb-3 text-[17px] leading-relaxed text-fg outline-none transition-colors [field-sizing:content] placeholder:text-faint focus:border-fg"
            />
          </label>

          {/* honeypot, hidden from people */}
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            aria-hidden
            className="absolute -left-[9999px] h-px w-px opacity-0"
            name="website"
          />

          <div className="mt-10 flex items-center gap-6">
            <Magnetic>
              <button
                type="submit"
                disabled={!valid || status === "sending"}
                className="group relative grid size-28 place-items-center overflow-hidden rounded-full bg-fg text-bg transition-opacity duration-300 disabled:opacity-30 md:size-32"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-muted transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-enabled:group-hover:translate-y-0" />
                <span className="label relative">{status === "sending" ? "Sending" : "Send"}</span>
              </button>
            </Magnetic>
            <p className="label max-w-[26ch] text-muted" aria-live="polite">
              {status === "error"
                ? "That didn't go through. Try again, or email me directly."
                : valid
                  ? "Ready when you are."
                  : "Name, email and a line or two."}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
