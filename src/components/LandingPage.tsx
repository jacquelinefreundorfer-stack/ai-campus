import { createServerFn } from "@tanstack/react-start";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { useState } from "react";
import { t } from "~/lib/i18n";
import type { Locale } from "~/lib/i18n";

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
      return { success: false, error: "already" };
    }

    entries.push({ email, timestamp: new Date().toISOString() });
    await writeFile(waitlistPath, JSON.stringify(entries, null, 2));
    return { success: true };
  });

// ── Props ───────────────────────────────────────────────────────────────────

export function LandingPage({ locale }: { locale: Locale }) {
  return (
    <div className="min-h-dvh pt-[49px]">
      <Hero locale={locale} />
      <Experience locale={locale} />
      <Programs locale={locale} />
      <Certificates locale={locale} />
      <Trust locale={locale} />
      <JournalTeaser locale={locale} />
      <FoundingClass locale={locale} />
      <Footer locale={locale} />
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

function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center bg-navy px-6 py-20 text-center text-white">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold/50" />

      <div className="relative z-10 max-w-4xl">
        <div className="mb-10">
          <Ornament />
        </div>

        <h1 className="mb-5 font-serif text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          {t(locale, "hero.headline")}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl font-light leading-relaxed text-gray-300 sm:text-2xl">
          {t(locale, "hero.subheadline")}
        </p>

        <GoldDivider className="mb-12" />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={locale === "en" ? "/#programs" : `/${locale}/#programs`}
            className="inline-flex min-w-[180px] justify-center rounded-sm bg-crimson px-8 py-3.5 text-base font-medium tracking-wide text-white transition-all hover:bg-crimson-dark"
          >
            {t(locale, "hero.explorePrograms")}
          </a>
          <a
            href={locale === "en" ? "/#waitlist" : `/${locale}/#waitlist`}
            className="inline-flex min-w-[180px] justify-center rounded-sm border border-white/40 px-8 py-3.5 text-base font-medium tracking-wide text-white transition-all hover:border-white/70 hover:bg-white/5"
          >
            {t(locale, "hero.joinWaitlist")}
          </a>
        </div>
      </div>

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

const pillarIcons = [
  (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
];

function Experience({ locale }: { locale: Locale }) {
  const pillars = [
    { titleKey: "experience.pillar1Title", descKey: "experience.pillar1Desc" },
    { titleKey: "experience.pillar2Title", descKey: "experience.pillar2Desc" },
    { titleKey: "experience.pillar3Title", descKey: "experience.pillar3Desc" },
  ];

  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            {t(locale, "experience.label")}
          </p>
          <h2 className="mb-5 font-serif text-3xl font-bold text-navy sm:text-4xl">
            {t(locale, "experience.heading")}
          </h2>
          <GoldDivider />
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            {t(locale, "experience.subtext")}
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div key={pillar.titleKey} className="text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold-pale text-navy">
                {pillarIcons[i]}
              </div>
              <h3 className="mb-3 font-serif text-xl font-semibold text-navy">
                {t(locale, pillar.titleKey)}
              </h3>
              <p className="leading-relaxed text-gray-600">
                {t(locale, pillar.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Programs ───────────────────────────────────────────────────────

function Programs({ locale }: { locale: Locale }) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const programs = [
    {
      id: "ai-practitioner",
      bundleId: 1,
      deptKey: "programs.course1Dept",
      titleKey: "programs.course1Title",
      descKey: "programs.course1Desc",
      highlightsKeys: ["programs.course1HL1", "programs.course1HL2", "programs.course1HL3", "programs.course1HL4"],
      durationKey: "programs.course1Duration",
      regularPrice: 149,
      launchPrice: 79,
      popular: true,
    },
    {
      id: "digital-marketing",
      bundleId: 1,
      deptKey: "programs.course2Dept",
      titleKey: "programs.course2Title",
      descKey: "programs.course2Desc",
      highlightsKeys: ["programs.course2HL1", "programs.course2HL2", "programs.course2HL3", "programs.course2HL4"],
      durationKey: "programs.course2Duration",
      regularPrice: 129,
      launchPrice: 69,
      popular: false,
    },
    {
      id: "data-science",
      bundleId: 1,
      deptKey: "programs.course3Dept",
      titleKey: "programs.course3Title",
      descKey: "programs.course3Desc",
      highlightsKeys: ["programs.course3HL1", "programs.course3HL2", "programs.course3HL3", "programs.course3HL4"],
      durationKey: "programs.course3Duration",
      regularPrice: 149,
      launchPrice: 79,
      popular: false,
    },
  ];

  return (
    <section id="programs" className="bg-cream px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            {t(locale, "programs.label")}
          </p>
          <h2 className="mb-5 font-serif text-3xl font-bold text-navy sm:text-4xl">
            {t(locale, "programs.heading")}
          </h2>
          <GoldDivider />
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            {t(locale, "programs.subtext")}
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
                  {t(locale, "programs.mostPopular")}
                </span>
              )}

              <p className="mb-2 font-sans text-xs font-medium uppercase tracking-widest text-gold">
                {t(locale, program.deptKey)}
              </p>

              <h3 className="mb-3 font-serif text-xl font-bold leading-snug text-navy">
                {t(locale, program.titleKey)}
              </h3>

              <p className="mb-6 leading-relaxed text-gray-600">
                {t(locale, program.descKey)}
              </p>

              <div className="mb-6 border-t border-gray-100 pt-5">
                <p className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider text-navy">
                  {t(locale, "programs.curriculumHighlights")}
                </p>
                <ul className="space-y-2">
                  {program.highlightsKeys.map((key) => (
                    <li
                      key={key}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="mt-0.5 flex-shrink-0 text-gold">—</span>
                      <span>{t(locale, key)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4 text-sm text-gray-500">
                <span>{t(locale, program.durationKey)}</span>
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
                  href={`${prefix}/programs`}
                  className={`inline-flex w-full justify-center rounded-sm px-6 py-3 text-sm font-medium tracking-wide transition-all ${
                    program.popular
                      ? "bg-crimson text-white hover:bg-crimson-dark"
                      : "bg-navy text-white hover:bg-navy-light"
                  }`}
                >
                  {t(locale, "programs.enrollNow")}
                </a>
                <a
                  href={`${prefix}/programs/${program.bundleId}`}
                  className="inline-flex w-full justify-center rounded-sm border border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 transition-all hover:border-navy hover:text-navy"
                >
                  {t(locale, "programs.viewCurriculum")}
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

function Certificates({ locale }: { locale: Locale }) {
  const features = [
    {
      titleKey: "certificates.feature1Title",
      descKey: "certificates.feature1Desc",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      titleKey: "certificates.feature2Title",
      descKey: "certificates.feature2Desc",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2m4 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      titleKey: "certificates.feature3Title",
      descKey: "certificates.feature3Desc",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            {t(locale, "certificates.label")}
          </p>
          <h2 className="mb-5 font-serif text-3xl font-bold text-navy sm:text-4xl">
            {t(locale, "certificates.heading")}
          </h2>
          <GoldDivider />
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            {t(locale, "certificates.subtext")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-8">
            {features.map((f) => (
              <div key={f.titleKey} className="flex gap-5">
                <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold-pale text-navy">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-navy">
                    {t(locale, f.titleKey)}
                  </h3>
                  <p className="mt-1 leading-relaxed text-gray-600">
                    {t(locale, f.descKey)}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-8 text-center">
              <a
                href="/verify/sample"
                className="inline-flex items-center gap-2 rounded-sm border border-gold/50 px-6 py-3 text-sm font-medium text-navy transition-all hover:bg-gold-pale"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t(locale, "certificates.viewSample")}
              </a>
            </div>
          </div>

          <div className="flex-1">
            <CertificateMock locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificateMock({ locale }: { locale: Locale }) {
  return (
    <div className="mx-auto max-w-md border-8 border-double border-gold/30 bg-[#fdfaf3] p-10 shadow-lg">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-1.5 h-px w-12 bg-crimson/60" />
        <div className="mx-auto h-px w-20 bg-navy/80" />
      </div>

      <div className="mb-8 flex justify-center">
        <div className="flex h-22 w-22 items-center justify-center rounded-full border-2 border-gold/40 bg-gold-pale">
          <div className="text-center">
            <div className="font-serif text-xl font-bold leading-none text-navy">AI</div>
            <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">Campus</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="mb-1 font-serif text-xs uppercase tracking-[0.25em] text-gray-500">
          {t(locale, "certificates.certLabel")}
        </p>
        <p className="mb-1 font-serif text-sm text-gray-400 italic">
          {t(locale, "certificates.certifiesThat")}
        </p>
        <p className="mb-4 font-serif text-2xl font-bold text-navy">
          {t(locale, "certificates.sampleStudent")}
        </p>
        <p className="mb-1 font-serif text-sm text-gray-400 italic">
          {t(locale, "certificates.hasCompleted")}
        </p>
        <p className="mb-5 font-serif text-lg font-semibold text-navy">
          {t(locale, "certificates.sampleProgram")}
        </p>

        <div className="mb-5 flex justify-center gap-5 text-xs tracking-wide text-gray-500">
          <span>8 {t(locale, "certificates.modules")}</span>
          <span className="text-gold">·</span>
          <span>25 {t(locale, "certificates.hours")}</span>
          <span className="text-gold">·</span>
          <span>{t(locale, "certificates.skillsVerified")}</span>
        </div>

        <div className="mx-auto mb-2 h-16 w-16 border border-gray-300 bg-white p-1">
          <div className="grid h-full w-full grid-cols-5 gap-px">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={Math.random() > 0.45 ? "bg-navy" : "bg-white"} />
            ))}
          </div>
        </div>
        <p className="font-sans text-[10px] tracking-wide text-gray-400">
          {t(locale, "certificates.scanToVerify")} · aicampus.ai/verify/abc123
        </p>
      </div>

      <div className="mt-5 text-center">
        <div className="mx-auto h-px w-20 bg-navy/80" />
        <div className="mx-auto mt-1.5 h-px w-12 bg-crimson/60" />
      </div>
    </div>
  );
}

// ── Section: Trust ──────────────────────────────────────────────────────────

function Trust({ locale }: { locale: Locale }) {
  const trustBadges = [
    { titleKey: "trust.badge1Title", descKey: "trust.badge1Desc", icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { titleKey: "trust.badge2Title", descKey: "trust.badge2Desc", icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { titleKey: "trust.badge3Title", descKey: "trust.badge3Desc", icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )},
  ];

  const testimonials = [
    { quoteKey: "trust.testimonial1Quote", nameKey: "trust.testimonial1Name", roleKey: "trust.testimonial1Role" },
    { quoteKey: "trust.testimonial2Quote", nameKey: "trust.testimonial2Name", roleKey: "trust.testimonial2Role" },
    { quoteKey: "trust.testimonial3Quote", nameKey: "trust.testimonial3Name", roleKey: "trust.testimonial3Role" },
  ];

  const partnerCompanies = ["Goldman Sachs", "Google", "McKinsey & Company", "Deloitte", "Microsoft"];

  return (
    <section className="bg-cream px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-24 grid gap-8 sm:grid-cols-3">
          {trustBadges.map((badge) => (
            <div key={badge.titleKey} className="flex flex-col items-center bg-white p-8 text-center shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold-pale text-navy">
                {badge.icon}
              </div>
              <h3 className="mb-3 font-serif text-lg font-semibold text-navy">
                {t(locale, badge.titleKey)}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {t(locale, badge.descKey)}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-24 text-center">
          <p className="mb-8 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            {t(locale, "trust.trustedBy")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partnerCompanies.map((company) => (
              <div key={company} className="flex h-16 min-w-[140px] items-center justify-center border border-gray-200 bg-white px-6">
                <span className="font-sans text-sm font-medium uppercase tracking-widest text-gray-400">{company}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 font-serif text-xs italic text-gray-400">
            {t(locale, "trust.aspirational")}
          </p>
        </div>

        <div className="text-center">
          <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            {t(locale, "trust.testimonialsLabel")}
          </p>
          <h2 className="mb-5 font-serif text-3xl font-bold text-navy sm:text-4xl">
            {t(locale, "trust.testimonialsHeading")}
          </h2>
          <GoldDivider />
          <p className="mx-auto mt-6 mb-14 max-w-xl text-lg leading-relaxed text-gray-600">
            {t(locale, "trust.testimonialsSubtext")}
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((tData) => (
              <div key={tData.nameKey} className="flex flex-col bg-white p-8 text-left shadow-sm">
                <span className="mb-4 font-serif text-5xl leading-none text-gold/30">&ldquo;</span>
                <p className="mb-8 flex-grow leading-relaxed text-gray-600">
                  {t(locale, tData.quoteKey)}
                </p>
                <div className="border-t border-gray-100 pt-5">
                  <p className="font-serif font-semibold text-navy">{t(locale, tData.nameKey)}</p>
                  <p className="text-sm text-gray-500">{t(locale, tData.roleKey)}</p>
                  <span className="mt-2 inline-block font-serif text-xs italic text-gold">
                    {t(locale, "trust.foundingStudent")}
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

// ── Section: From Our Journal ───────────────────────────────────────────

function JournalTeaser({ locale }: { locale: Locale }) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  
  // Static teaser posts (will be replaced by DB-driven data later)
  const posts = [
    {
      title: "5 AI Skills That Will Define Your Career in 2026",
      slug: "ai-career",
      excerpt: "From prompt engineering to AI agent orchestration, these are the competencies separating professionals who thrive from those who get left behind.",
      date: "2026-07-20",
    },
    {
      title: "How to Use AI for Marketing: A Complete Beginner's Guide",
      slug: "ai-marketing",
      excerpt: "Practical strategies for using AI tools to transform your marketing workflows, from content creation to customer analytics.",
      date: "2026-07-18",
    },
  ];

  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-gold">
            From Our Journal
          </p>
          <h2 className="mb-5 font-serif text-3xl font-bold text-navy sm:text-4xl">
            Insights & Articles
          </h2>
          <GoldDivider />
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            Practical articles on AI, data science, marketing, and career growth — written by the AI Campus faculty.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`${prefix}/blog/${post.slug}`}
              className="group border border-gray-200 bg-white p-8 transition-all hover:border-gold/40 hover:shadow-md"
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gold">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h3 className="mb-3 font-serif text-xl font-bold text-navy group-hover:text-navy-light transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-600">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:text-navy transition-colors">
                Read article →
              </span>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={`${prefix}/blog`}
            className="inline-flex items-center gap-2 rounded-sm border border-navy px-6 py-3 text-sm font-medium text-navy transition-all hover:bg-navy hover:text-white"
          >
            View All Articles →
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Section: Join the Founding Class ────────────────────────────────────────

function FoundingClass({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setStatus("error");
      setMessage(t(locale, "waitlist.invalidEmail"));
      return;
    }

    setStatus("loading");

    try {
      const result = await joinWaitlist({ data: email });
      if (result.success) {
        setStatus("success");
        setMessage(t(locale, "waitlist.successMsg"));
        setEmail("");
      } else {
        setStatus("error");
        setMessage(result.error === "already" ? t(locale, "waitlist.alreadyMsg") : t(locale, "waitlist.errorMsg"));
      }
    } catch {
      setStatus("error");
      setMessage(t(locale, "waitlist.errorMsg"));
    }
  };

  return (
    <section id="waitlist" className="bg-navy px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Ornament />

        <h2 className="mt-8 mb-5 font-serif text-3xl font-bold text-white sm:text-4xl">
          {t(locale, "waitlist.heading")}
        </h2>

        <p className="mb-4 text-lg leading-relaxed text-gray-300">
          {t(locale, "waitlist.body")}
        </p>

        <p className="mb-10 font-serif text-sm italic text-gold/80">
          {t(locale, "waitlist.privacyNote")}
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
              placeholder={t(locale, "waitlist.placeholder")}
              className="flex-1 border border-white/20 bg-white/5 px-4 py-3.5 font-sans text-white placeholder-gray-500 outline-none transition-colors focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              disabled={status === "loading"}
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-crimson px-8 py-3.5 font-sans text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-crimson-dark disabled:opacity-60"
            >
              {status === "loading" ? t(locale, "waitlist.loading") : t(locale, "waitlist.button")}
            </button>
          </div>

          {status === "success" && (
            <p className="mt-4 bg-crimson/10 px-4 py-3 font-serif text-sm text-gold">{message}</p>
          )}

          {status === "error" && (
            <p className="mt-4 bg-crimson/10 px-4 py-3 font-sans text-sm text-red-300">{message}</p>
          )}
        </form>

        <p className="mt-8 font-serif text-xs italic text-gray-500">
          {t(locale, "waitlist.footerText")}
        </p>
      </div>
    </section>
  );
}

// ── Section: Footer ─────────────────────────────────────────────────────────

function Footer({ locale }: { locale: Locale }) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center border border-gold/40 bg-navy">
                <span className="font-serif text-sm font-bold text-white">AI</span>
              </div>
              <span className="font-serif text-lg font-bold text-navy">
                {t(locale, "nav.brand")}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              {t(locale, "footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold uppercase tracking-widest text-navy">
              {t(locale, "nav.quickLinks")}
            </h4>
            <ul className="space-y-2.5">
              <li><a href={`${prefix}/#programs`} className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "nav.programs")}</a></li>
              <li><a href={`${prefix}/#waitlist`} className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "nav.joinWaitlist")}</a></li>
              <li><a href="#" className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "nav.faq")}</a></li>
              <li><a href="/verify/sample" className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "nav.certVerify")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold uppercase tracking-widest text-navy">
              {t(locale, "nav.programs")}
            </h4>
            <ul className="space-y-2.5">
              <li><a href={`${prefix}/#programs`} className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "footer.programsLink1")}</a></li>
              <li><a href={`${prefix}/#programs`} className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "footer.programsLink2")}</a></li>
              <li><a href={`${prefix}/#programs`} className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "footer.programsLink3")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold uppercase tracking-widest text-navy">
              {t(locale, "nav.institution")}
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "nav.aboutUs")}</a></li>
              <li><a href="#" className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "nav.ourFaculty")}</a></li>
              <li><a href="#" className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "nav.accreditation")}</a></li>
              <li><a href="#" className="text-sm text-gray-500 transition-colors hover:text-navy">{t(locale, "nav.contactUs")}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-gray-100 pt-8 text-center">
          <p className="font-serif text-sm text-gray-400">
            {t(locale, "footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
