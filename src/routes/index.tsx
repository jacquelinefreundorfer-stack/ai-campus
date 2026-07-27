import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { useState } from "react";

// ── Server function: join waitlist ──────────────────────────────────────────

const waitlistPath = join(process.cwd(), "waitlist.json");

const joinWaitlist = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (typeof input !== "string" || !input.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    return input.trim().toLowerCase();
  })
  .handler(async ({ data: email }) => {
    let entries: { email: string; timestamp: string }[] = [];
    try {
      const raw = await readFile(waitlistPath, "utf8");
      entries = JSON.parse(raw);
    } catch {
      // File doesn't exist yet — start fresh
    }

    if (entries.some((e) => e.email === email)) {
      return { success: false, error: "You're already on the waitlist! We'll be in touch soon." };
    }

    entries.push({ email, timestamp: new Date().toISOString() });
    await writeFile(waitlistPath, JSON.stringify(entries, null, 2));
    return { success: true };
  });

// ── Route ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/")({
  component: Home,
});

// ── Page ────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <div className="min-h-dvh">
      <Hero />
      <HowItWorks />
      <Bundles />
      <Certificates />
      <TrustSignals />
      <WaitlistSection />
      <Footer />
    </div>
  );
}

// ── Section: Hero ───────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-800 px-6 py-20 text-center text-white">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px, 80px 80px",
        }}
      />

      <div className="relative z-10 max-w-4xl">
        <span className="mb-6 inline-block rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
          Now accepting founding members
        </span>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Learn AI. Apply it.{" "}
          <span className="text-emerald-400">Get Certified.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-indigo-200 sm:text-xl">
          AI-powered course bundles that teach you how to use AI in marketing,
          data, development, and more. Self-paced. Verifiable certificates.
          $49–79 during launch.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#bundles"
            className="inline-flex rounded-lg bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/40"
          >
            View Bundles
          </a>
          <a
            href="#waitlist"
            className="inline-flex rounded-lg border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            Join the Waitlist
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 z-10 animate-bounce">
        <svg
          className="h-6 w-6 text-indigo-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

// ── Section: How It Works ───────────────────────────────────────────────────

const steps = [
  {
    number: "1",
    title: "Choose a bundle",
    description:
      "Pick from curated bundles designed for real-world AI skills — from marketing to data science to software development.",
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Learn at your pace",
    description:
      "AI-generated, expert-reviewed lessons with hands-on projects and quizzes. Learn on your schedule, from any device.",
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Earn your certificate",
    description:
      "Pass the assessments and receive a verifiable certificate with QR verification. Share it on LinkedIn with one click.",
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-xl text-lg text-gray-600">
            Three simple steps to mastering AI and advancing your career.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              {/* Connector line (desktop only) */}
              {step.number !== "3" && (
                <div className="absolute left-[calc(50%+3rem)] top-12 hidden h-0.5 w-[calc(100%-6rem)] bg-gray-200 md:block" />
              )}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                {step.icon}
              </div>
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Bundles ────────────────────────────────────────────────────────

const bundles = [
  {
    id: "ai-practitioner",
    title: "AI & Generative AI Practitioner",
    subtitle: "Flagship",
    description:
      "Master prompt engineering, AI agents, custom GPTs, and LLM application development. The essential AI skillset for every profession.",
    modules: 8,
    hours: 25,
    regularPrice: 149,
    launchPrice: 79,
    badge: "Most Popular",
    accent: "emerald",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing & Growth",
    subtitle: "",
    description:
      "Learn SEO, paid ads, content marketing, email automation, and how to leverage AI for every marketing channel.",
    modules: 8,
    hours: 25,
    regularPrice: 129,
    launchPrice: 69,
    accent: "indigo",
  },
  {
    id: "data-science",
    title: "Data Science & Business Analytics",
    subtitle: "",
    description:
      "SQL, Python for data analysis, visualization, A/B testing, and using AI to extract insights from data.",
    modules: 10,
    hours: 30,
    regularPrice: 149,
    launchPrice: 79,
    accent: "indigo",
  },
];

function Bundles() {
  return (
    <section id="bundles" className="bg-gray-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Bundle
          </h2>
          <p className="mx-auto max-w-xl text-lg text-gray-600">
            Curated AI-powered course bundles. Real skills. Verifiable
            certificates. Launch pricing — lock in before prices go up.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {bundles.map((bundle) => {
            const isPopular = bundle.badge === "Most Popular";
            return (
              <div
                key={bundle.id}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md ${
                  isPopular
                    ? "border-emerald-300 ring-1 ring-emerald-300"
                    : "border-gray-200"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-sm font-semibold text-white shadow-md">
                    Most Popular
                  </span>
                )}

                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {bundle.title}
                </h3>
                {bundle.subtitle && (
                  <p className="mb-4 text-sm font-medium uppercase tracking-wide text-emerald-600">
                    {bundle.subtitle}
                  </p>
                )}

                <p className="mb-6 flex-grow text-gray-600">
                  {bundle.description}
                </p>

                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg
                      className="h-4 w-4 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    {bundle.modules} modules
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg
                      className="h-4 w-4 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    ~{bundle.hours} hours to complete
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${bundle.launchPrice}
                  </span>
                  <span className="ml-2 text-lg text-gray-400 line-through">
                    ${bundle.regularPrice}
                  </span>
                  <span className="ml-2 text-sm font-medium text-emerald-600">
                    Save {Math.round(((bundle.regularPrice - bundle.launchPrice) / bundle.regularPrice) * 100)}%
                  </span>
                </div>

                <a
                  href="#waitlist"
                  className={`inline-flex w-full justify-center rounded-lg px-6 py-3 text-base font-semibold transition-all ${
                    isPopular
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-400"
                      : "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500"
                  }`}
                >
                  Join Waitlist
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Section: Certificates ───────────────────────────────────────────────────

function Certificates() {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Verifiable Certificates
          </h2>
          <p className="mx-auto max-w-xl text-lg text-gray-600">
            Earn certificates that prove your skills — not just that you watched
            videos.
          </p>
        </div>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
          {/* Left: Features */}
          <div className="flex-1 space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Skills-based credentialing
                </h3>
                <p className="text-gray-600">
                  Each certificate lists the specific competencies you've
                  demonstrated — not just a course title. Employers see exactly
                  what you can do.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2m4 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  QR code verification
                </h3>
                <p className="text-gray-600">
                  Every certificate includes a unique QR code that links to a
                  public verification page. Anyone can confirm your credential
                  is authentic in seconds.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  One-click LinkedIn sharing
                </h3>
                <p className="text-gray-600">
                  Share your achievement directly to your LinkedIn profile.
                  Coming in Phase 2: Credly digital badges for even wider
                  recognition.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Mock Certificate */}
          <div className="flex-1">
            <CertificateMock />
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificateMock() {
  return (
    <div className="mx-auto max-w-md rounded-sm border-8 border-double border-indigo-200 bg-[#fdfaf3] p-8 shadow-xl">
      {/* Top ornament */}
      <div className="mb-4 text-center">
        <div className="mx-auto mb-2 h-1 w-16 bg-emerald-500" />
        <div className="mx-auto h-1 w-24 bg-indigo-600" />
      </div>

      {/* Seal / emblem */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-indigo-300 bg-indigo-50">
          <div className="text-center">
            <div className="text-lg font-bold leading-none text-indigo-700">
              AI
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
              Campus
            </div>
          </div>
        </div>
      </div>

      {/* Certificate content */}
      <div className="text-center">
        <p className="mb-1 font-serif text-sm uppercase tracking-[0.2em] text-gray-500">
          Certificate of Completion
        </p>
        <p className="mb-1 text-xs text-gray-400">This certifies that</p>
        <p className="mb-3 font-serif text-xl font-bold text-gray-900">
          Jane Smith
        </p>
        <p className="mb-1 text-xs text-gray-400">
          has successfully completed
        </p>
        <p className="mb-4 font-serif text-lg font-semibold text-indigo-800">
          AI & Generative AI Practitioner
        </p>

        <div className="mb-4 flex justify-center gap-6 text-xs text-gray-500">
          <span>8 Modules</span>
          <span>•</span>
          <span>25 Hours</span>
          <span>•</span>
          <span>Skills Verified</span>
        </div>

        {/* QR placeholder */}
        <div className="mx-auto mb-2 h-16 w-16 rounded border border-gray-300 bg-white p-1">
          <div className="grid h-full w-full grid-cols-5 gap-px">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={
                  Math.random() > 0.45 ? "bg-indigo-800" : "bg-white"
                }
              />
            ))}
          </div>
        </div>
        <p className="text-[10px] text-gray-400">
          Scan to verify • aicampus.ai/verify/abc123
        </p>
      </div>

      {/* Bottom ornament */}
      <div className="mt-4 text-center">
        <div className="mx-auto h-1 w-24 bg-indigo-600" />
        <div className="mx-auto mt-2 h-1 w-16 bg-emerald-500" />
      </div>
    </div>
  );
}

// ── Section: Trust Signals ──────────────────────────────────────────────────

const trustBadges = [
  {
    title: "30-Day Money-Back Guarantee",
    description: "Not satisfied? Get a full refund, no questions asked.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Expert-Reviewed Curriculum",
    description:
      "Every lesson reviewed by industry professionals before publishing.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Verifiable Certificates",
    description:
      "QR-coded certificates that anyone can verify online in seconds.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
];

const testimonials = [
  {
    quote:
      "The AI Practitioner bundle gave me practical skills I use every day. The prompt engineering module alone transformed how I work with LLMs.",
    name: "Alex Chen",
    role: "Product Manager at TechCorp",
    badge: "Coming: Founding student review",
  },
  {
    quote:
      "I was skeptical about AI-generated courses, but the expert review makes all the difference. The content is current, practical, and immediately applicable.",
    name: "Sarah Okafor",
    role: "Marketing Director at GrowthLab",
    badge: "Coming: Founding student review",
  },
  {
    quote:
      "The Data Science bundle gave me the SQL and Python skills I needed to switch careers. The certificate helped me stand out in interviews.",
    name: "Marcus Rivera",
    role: "Junior Data Analyst at DataCo",
    badge: "Coming: Founding student review",
  },
];

function TrustSignals() {
  return (
    <section className="bg-gray-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Trust badges */}
        <div className="mb-20 grid gap-8 sm:grid-cols-3">
          {trustBadges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                {badge.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-500">{badge.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Hear from our founding students
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-lg text-gray-600">
            Real reviews from our beta cohort will appear here after launch.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-xl bg-white p-6 text-left shadow-sm"
              >
                {/* Quote mark */}
                <svg
                  className="mb-4 h-8 w-8 text-indigo-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="mb-6 flex-grow text-gray-600 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                  <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section: Waitlist ───────────────────────────────────────────────────────

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const result = await joinWaitlist({ data: email });
      if (result.success) {
        setStatus("success");
        setMessage("You're on the list! We'll notify you when we launch.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(result.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="waitlist" className="bg-indigo-900 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Be the first to enroll
        </h2>
        <p className="mb-10 text-lg text-indigo-200">
          Join the waitlist for early access and founding member pricing
          (40–50% off). No spam, just launch updates.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error" || status === "success") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              placeholder="you@example.com"
              className="flex-1 rounded-lg border border-indigo-700 bg-indigo-800 px-4 py-3.5 text-white placeholder-indigo-400 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              disabled={status === "loading"}
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 disabled:opacity-60"
            >
              {status === "loading" ? "Joining..." : "Join Waitlist"}
            </button>
          </div>

          {status === "success" && (
            <p className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
              {message}
            </p>
          )}

          {status === "error" && (
            <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
              {message}
            </p>
          )}
        </form>

        <p className="mt-6 text-sm text-indigo-400">
          Founding member pricing is limited. Lock in your discount today.
        </p>
      </div>
    </section>
  );
}

// ── Section: Footer ─────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                AI
              </div>
              <span className="text-lg font-bold text-gray-900">
                AI Campus
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Master AI. Advance your career.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-indigo-600">
              About
            </a>
            <a href="#bundles" className="hover:text-indigo-600">
              Bundles
            </a>
            <a href="#" className="hover:text-indigo-600">
              Certificates
            </a>
            <a href="#" className="hover:text-indigo-600">
              FAQ
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
          &copy; 2026 AI Campus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
