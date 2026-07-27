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
      <Experience />
      <Programs />
      <Certificates />
      <Trust />
      <FoundingClass />
      <Footer />
    </div>
  );
}

// ── Decorative elements ─────────────────────────────────────────────────────

function GoldDivider({ className = "" }: { className?: string }) {
  return <div className={`mx-auto h-px w-20 bg-gold/60 ${className}`} />;
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="h-px w-6 bg-gold/40" />
      <div className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
      <div className="h-px w-6 bg-gold/40" />
    </div>
  );
}

// ── Section: Hero ───────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center bg-navy px-6 py-20 text-center text-white">
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold/50" />

      <div className="relative z-10 max-w-4xl">
        <div className="mb-10">
          <Ornament />
        </div>

        <h1 className="mb-5 font-serif text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          AI Campus
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl font-light leading-relaxed text-gray-300 sm:text-2xl">
          An online university for the age of artificial intelligence
        </p>

        <GoldDivider className="mb-12" />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#programs"
            className="inline-flex min-w-[180px] justify-center rounded-sm bg-crimson px-8 py-3.5 text-base font-medium tracking-wide text-white transition-all hover:bg-crimson-dark"
          >
            Explore Programs
          </a>
          <a
            href="#waitlist"
            className="inline-flex min-w-[180px] justify-center rounded-sm border border-white/40 px-8 py-3.5 text-base font-medium tracking-wide text-white transition-all hover:border-white/70 hover:bg-white/5"
          >
            Join the Waitlist
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 z-10 animate-bounce">
        <svg
          className="h-5 w-5 text-gold/50"
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

// ── Section: The AI Campus Experience ───────────────────────────────────────

const pillars = [
  {
    title: "Rigorous Curriculum",
    description:
      "Programs designed by domain experts and refined with AI to ensure every lesson is current, practical, and intellectually demanding.",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
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
    title: "Self-Directed Study",
    description:
      "Learn on your own schedule, at your own pace. Our platform is built for professionals who need flexibility without sacrificing depth.",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Verifiable Mastery",
    description:
      "Earn credentials that matter. Every certificate is digitally verifiable, listing the specific competencies you have demonstrated.",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
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

function Experience() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            How We Teach
          </p>
          <h2 className="mb-5 font-serif text-3xl font-bold text-navy sm:text-4xl">
            The AI Campus Experience
          </h2>
          <GoldDivider />
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            A return to rigorous, structured learning — delivered through a
            modern platform built for the way professionals learn today.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold-pale text-navy">
                {pillar.icon}
              </div>
              <h3 className="mb-3 font-serif text-xl font-semibold text-navy">
                {pillar.title}
              </h3>
              <p className="leading-relaxed text-gray-600">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Programs ───────────────────────────────────────────────────────

const programs = [
  {
    id: "ai-practitioner",
    bundleId: 1,
    title: "AI & Generative AI Practitioner",
    department: "School of Applied AI",
    description:
      "Master prompt engineering, AI agents, custom GPTs, and LLM application development. The essential AI skillset for every profession in the modern economy.",
    highlights: [
      "Prompt Engineering & Chain-of-Thought Reasoning",
      "Building Custom GPTs & Autonomous AI Agents",
      "LLM Application Architecture & Deployment",
      "Responsible AI, Safety & Ethics Frameworks",
    ],
    duration: "8 modules · ~25 hours",
    regularPrice: 149,
    launchPrice: 79,
    popular: true,
  },
  {
    id: "digital-marketing",
    bundleId: 1,
    title: "Digital Marketing & Growth Strategy",
    department: "School of Business",
    description:
      "Learn SEO, paid advertising, content marketing, and marketing automation — then amplify every channel with AI-powered tools and techniques.",
    highlights: [
      "SEO & Content Strategy in the AI Era",
      "Paid Media, Attribution & Budget Optimization",
      "Email Marketing Automation & Personalization",
      "AI-Powered Analytics & Customer Insights",
    ],
    duration: "8 modules · ~25 hours",
    regularPrice: 129,
    launchPrice: 69,
  },
  {
    id: "data-science",
    bundleId: 1,
    title: "Data Science & Business Analytics",
    department: "School of Data & Technology",
    description:
      "SQL, Python for data analysis, statistical modeling, visualization, and applying AI to extract actionable insights from complex datasets.",
    highlights: [
      "SQL for Business Intelligence & Reporting",
      "Python for Data Manipulation & Analysis",
      "Statistical Methods & A/B Testing Design",
      "AI-Assisted Data Visualization & Storytelling",
    ],
    duration: "10 modules · ~30 hours",
    regularPrice: 149,
    launchPrice: 79,
  },
];

function Programs() {
  return (
    <section id="programs" className="bg-cream px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            Our Offerings
          </p>
          <h2 className="mb-5 font-serif text-3xl font-bold text-navy sm:text-4xl">
            Programs of Study
          </h2>
          <GoldDivider />
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            Curated programs designed for immediate professional application.
            Founding cohort pricing available for a limited time.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.id}
              className={`relative flex flex-col border bg-white p-8 ${
                program.popular
                  ? "border-gold/50 shadow-md"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {program.popular && (
                <span className="mb-4 inline-block self-start border border-crimson/40 px-3 py-1 font-serif text-xs font-medium uppercase tracking-wider text-crimson">
                  Most Popular
                </span>
              )}

              <p className="mb-2 font-sans text-xs font-medium uppercase tracking-widest text-gold">
                {program.department}
              </p>

              <h3 className="mb-3 font-serif text-xl font-bold leading-snug text-navy">
                {program.title}
              </h3>

              <p className="mb-6 leading-relaxed text-gray-600">
                {program.description}
              </p>

              <div className="mb-6 border-t border-gray-100 pt-5">
                <p className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider text-navy">
                  Curriculum Highlights
                </p>
                <ul className="space-y-2">
                  {program.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="mt-0.5 flex-shrink-0 text-gold">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4 text-sm text-gray-500">
                <span>{program.duration}</span>
              </div>

              <div className="mb-6">
                <span className="font-serif text-2xl font-bold text-navy">
                  ${program.launchPrice} USD
                </span>
                <span className="ml-2 text-base text-gray-400 line-through">
                  ${program.regularPrice} USD
                </span>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <a
                  href="/programs"
                  className={`inline-flex w-full justify-center rounded-sm px-6 py-3 text-sm font-medium tracking-wide transition-all ${
                    program.popular
                      ? "bg-crimson text-white hover:bg-crimson-dark"
                      : "bg-navy text-white hover:bg-navy-light"
                  }`}
                >
                  Enroll Now
                </a>
                <a
                  href={`/programs/${program.bundleId}`}
                  className="inline-flex w-full justify-center rounded-sm border border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 transition-all hover:border-navy hover:text-navy"
                >
                  View Curriculum
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Certificates ───────────────────────────────────────────────────

function Certificates() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            Credentials
          </p>
          <h2 className="mb-5 font-serif text-3xl font-bold text-navy sm:text-4xl">
            Verifiable Credentials
          </h2>
          <GoldDivider />
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            Earn a digital certificate of completion that proves your
            competencies — not just your attendance.
          </p>
        </div>

        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start">
          {/* Left: Features */}
          <div className="flex-1 space-y-8">
            <div className="flex gap-5">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold-pale text-navy">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-navy">
                  Competency-Based Credentialing
                </h3>
                <p className="mt-1 leading-relaxed text-gray-600">
                  Each certificate enumerates the specific skills and
                  competencies you have demonstrated. Employers and peers see
                  precisely what you are qualified to do.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold-pale text-navy">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v1m6 11h2m-6 0h-2m4 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-navy">
                  QR Code Verification
                </h3>
                <p className="mt-1 leading-relaxed text-gray-600">
                  Every certificate bears a unique QR code linking to a public
                  verification page. Anyone can authenticate your credential in
                  seconds — no login required.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold-pale text-navy">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-navy">
                  Professional Network Integration
                </h3>
                <p className="mt-1 leading-relaxed text-gray-600">
                  Share your achievement directly to LinkedIn with one click.
                  Credly digital badges and broader credential network support
                  coming in a future term.
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
    <div className="mx-auto max-w-md border-8 border-double border-gold/30 bg-[#fdfaf3] p-10 shadow-lg">
      {/* Top ornament */}
      <div className="mb-5 text-center">
        <div className="mx-auto mb-1.5 h-px w-12 bg-crimson/60" />
        <div className="mx-auto h-px w-20 bg-navy/80" />
      </div>

      {/* Seal / emblem */}
      <div className="mb-8 flex justify-center">
        <div className="flex h-22 w-22 items-center justify-center rounded-full border-2 border-gold/40 bg-gold-pale">
          <div className="text-center">
            <div className="font-serif text-xl font-bold leading-none text-navy">
              AI
            </div>
            <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
              Campus
            </div>
          </div>
        </div>
      </div>

      {/* Certificate content */}
      <div className="text-center">
        <p className="mb-1 font-serif text-xs uppercase tracking-[0.25em] text-gray-500">
          Digital Certificate of Completion
        </p>
        <p className="mb-1 font-serif text-sm text-gray-400 italic">
          This certifies that
        </p>
        <p className="mb-4 font-serif text-2xl font-bold text-navy">
          Jane Smith
        </p>
        <p className="mb-1 font-serif text-sm text-gray-400 italic">
          has successfully completed the program
        </p>
        <p className="mb-5 font-serif text-lg font-semibold text-navy">
          AI & Generative AI Practitioner
        </p>

        <div className="mb-5 flex justify-center gap-5 text-xs tracking-wide text-gray-500">
          <span>8 Modules</span>
          <span className="text-gold">·</span>
          <span>25 Hours</span>
          <span className="text-gold">·</span>
          <span>Skills Verified</span>
        </div>

        {/* QR placeholder */}
        <div className="mx-auto mb-2 h-16 w-16 border border-gray-300 bg-white p-1">
          <div className="grid h-full w-full grid-cols-5 gap-px">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={
                  Math.random() > 0.45 ? "bg-navy" : "bg-white"
                }
              />
            ))}
          </div>
        </div>
        <p className="font-sans text-[10px] tracking-wide text-gray-400">
          Scan to verify · aicampus.ai/verify/abc123
        </p>
      </div>

      {/* Bottom ornament */}
      <div className="mt-5 text-center">
        <div className="mx-auto h-px w-20 bg-navy/80" />
        <div className="mx-auto mt-1.5 h-px w-12 bg-crimson/60" />
      </div>
    </div>
  );
}

// ── Section: Trust ──────────────────────────────────────────────────────────

const trustBadges = [
  {
    title: "30-Day Enrollment Guarantee",
    description:
      "If you are not satisfied with your program for any reason, you may withdraw within 30 days and receive a full refund. No conditions, no questions.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
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
      "Every lesson module is reviewed and refined by practicing professionals in the field before being published to students.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
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
    title: "Verifiable Digital Certificates",
    description:
      "Every credential issued includes QR-based verification. Third parties can confirm your certificate is authentic in seconds, at no cost.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
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
      "The AI Practitioner program gave me practical skills I use every day. The prompt engineering module alone transformed how I work with large language models.",
    name: "Alex Chen",
    role: "Product Manager, Technology Sector",
  },
  {
    quote:
      "I was skeptical about AI-generated courses, but the expert review makes all the difference. The content is current, practical, and immediately applicable to my work.",
    name: "Sarah Okafor",
    role: "Marketing Director, Growth Organization",
  },
  {
    quote:
      "The Data Science program gave me the SQL and Python skills I needed to transition into analytics. The certificate helped me stand out in my interviews.",
    name: "Marcus Rivera",
    role: "Data Analyst, Financial Services",
  },
];

const partnerCompanies = [
  "Goldman Sachs",
  "Google",
  "McKinsey & Company",
  "Deloitte",
  "Microsoft",
];

function Trust() {
  return (
    <section className="bg-cream px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Trust badges */}
        <div className="mb-24 grid gap-8 sm:grid-cols-3">
          {trustBadges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center bg-white p-8 text-center shadow-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold-pale text-navy">
                {badge.icon}
              </div>
              <h3 className="mb-3 font-serif text-lg font-semibold text-navy">
                {badge.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Partner companies */}
        <div className="mb-24 text-center">
          <p className="mb-8 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            Trusted by professionals from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partnerCompanies.map((company) => (
              <div
                key={company}
                className="flex h-16 min-w-[140px] items-center justify-center border border-gray-200 bg-white px-6"
              >
                <span className="font-sans text-sm font-medium uppercase tracking-widest text-gray-400">
                  {company}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 font-serif text-xs italic text-gray-400">
            Aspirational — our founding students join us from organizations like
            these
          </p>
        </div>

        {/* Testimonials */}
        <div className="text-center">
          <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            Testimonials
          </p>
          <h2 className="mb-5 font-serif text-3xl font-bold text-navy sm:text-4xl">
            What Our Students Say
          </h2>
          <GoldDivider />
          <p className="mx-auto mt-6 mb-14 max-w-xl text-lg leading-relaxed text-gray-600">
            Anticipated reviews from our founding cohort. These represent the
            experience we are building toward.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col bg-white p-8 text-left shadow-sm"
              >
                {/* Large quotation mark */}
                <span className="mb-4 font-serif text-5xl leading-none text-gold/30">
                  &ldquo;
                </span>

                <p className="mb-8 flex-grow leading-relaxed text-gray-600">
                  {t.quote}
                </p>

                <div className="border-t border-gray-100 pt-5">
                  <p className="font-serif font-semibold text-navy">
                    {t.name}
                  </p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                  <span className="mt-2 inline-block font-serif text-xs italic text-gold">
                    Founding Student
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

// ── Section: Join the Founding Class ────────────────────────────────────────

function FoundingClass() {
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
    <section id="waitlist" className="bg-navy px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Ornament />

        <h2 className="mt-8 mb-5 font-serif text-3xl font-bold text-white sm:text-4xl">
          Join the Founding Class
        </h2>

        <p className="mb-4 text-lg leading-relaxed text-gray-300">
          Be among the first to enroll when AI Campus opens its doors.
          Founding members receive priority access and preferred pricing
          (40–50% below standard tuition).
        </p>

        <p className="mb-10 font-serif text-sm italic text-gold/80">
          We will never share your address. Launch updates only.
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
              placeholder="your@email.com"
              className="flex-1 border border-white/20 bg-white/5 px-4 py-3.5 font-sans text-white placeholder-gray-500 outline-none transition-colors focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              disabled={status === "loading"}
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-crimson px-8 py-3.5 font-sans text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-crimson-dark disabled:opacity-60"
            >
              {status === "loading" ? "Registering..." : "Join the Waitlist"}
            </button>
          </div>

          {status === "success" && (
            <p className="mt-4 bg-crimson/10 px-4 py-3 font-serif text-sm text-gold">
              {message}
            </p>
          )}

          {status === "error" && (
            <p className="mt-4 bg-crimson/10 px-4 py-3 font-sans text-sm text-red-300">
              {message}
            </p>
          )}
        </form>

        <p className="mt-8 font-serif text-xs italic text-gray-500">
          Founding class enrollment is limited. Register your interest today.
        </p>
      </div>
    </section>
  );
}

// ── Section: Footer ─────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center border border-gold/40 bg-navy">
                <span className="font-serif text-sm font-bold text-white">
                  AI
                </span>
              </div>
              <span className="font-serif text-lg font-bold text-navy">
                AI Campus
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              An online university for the age of artificial intelligence.
              Rigorous programs. Verifiable credentials. Professional
              advancement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold uppercase tracking-widest text-navy">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#programs"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  Programs
                </a>
              </li>
              <li>
                <a
                  href="#waitlist"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  Join the Waitlist
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  Certificate Verification
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold uppercase tracking-widest text-navy">
              Programs
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#programs"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  AI & Generative AI
                </a>
              </li>
              <li>
                <a
                  href="#programs"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  Digital Marketing
                </a>
              </li>
              <li>
                <a
                  href="#programs"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  Data Science & Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* About & Contact */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold uppercase tracking-widest text-navy">
              Institution
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  About AI Campus
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  Our Faculty
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  Accreditation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-navy"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-gray-100 pt-8 text-center">
          <p className="font-serif text-sm text-gray-400">
            &copy; 2026 AI Campus. An accredited online institution.
          </p>
        </div>
      </div>
    </footer>
  );
}
