import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getBundle, getBundleModules, enrollInBundle } from "~/lib/server";
import { t } from "~/lib/i18n";
import type { Locale } from "~/lib/i18n";

export function ProgramDetailPageContent({
  locale,
  bundle,
}: {
  locale: Locale;
  bundle: any;
}) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const [email, setEmail] = useState("");
  const [enrollStatus, setEnrollStatus] = useState<
    "idle" | "loading" | "success" | "enrolled"
  >("idle");
  const [enrollMessage, setEnrollMessage] = useState("");

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setEnrollStatus("idle");
      setEnrollMessage(t(locale, "waitlist.invalidEmail"));
      return;
    }
    setEnrollStatus("loading");
    try {
      const result = await enrollInBundle({
        data: { email: email.trim().toLowerCase(), bundleId: bundle.id },
      });
      if (result.completedAt) {
        setEnrollStatus("enrolled");
        setEnrollMessage(t(locale, "programDetail.enrolled"));
      } else {
        setEnrollStatus("success");
        setEnrollMessage(t(locale, "programDetail.enrollSuccess"));
      }
    } catch {
      setEnrollStatus("idle");
      setEnrollMessage(t(locale, "waitlist.errorMsg"));
    }
  };

  if (!bundle) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center pt-[49px]">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-navy mb-4">
            Program not found
          </h1>
          <a href={prefix || "/"} className="text-gold hover:underline">
            {t(locale, "nav.backToHome")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream pt-[49px]">
      <div className="bg-navy px-6 py-16 text-center text-white">
        <a
          href={`${prefix}/programs`}
          className="text-gold/60 hover:text-gold text-sm mb-6 inline-block"
        >
          {t(locale, "nav.backToPrograms")}
        </a>
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">
          {bundle.title}
        </h1>
        {bundle.subtitle && (
          <p className="mt-2 text-lg text-gray-300 font-serif italic">
            {bundle.subtitle}
          </p>
        )}
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          {bundle.school}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-gray-200 shadow-sm p-8 md:p-10 mb-8">
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            {bundle.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <span>
              {bundle.modulesCount} {t(locale, "programsPage.modules")}
            </span>
            <span>·</span>
            <span>
              ~{bundle.hours} {t(locale, "programsPage.hours")}
            </span>
          </div>
          {bundle.launchPriceCents ? (
            <div className="mb-6">
              <span className="font-serif text-3xl font-bold text-navy">
                ${(bundle.launchPriceCents / 100).toFixed(0)} {t(locale, "programsPage.usd")}
              </span>
              <span className="ml-3 text-lg text-gray-400 line-through">
                ${(bundle.priceCents / 100).toFixed(0)} {t(locale, "programsPage.usd")}
              </span>
            </div>
          ) : (
            <div className="mb-6">
              <span className="font-serif text-3xl font-bold text-navy">
                ${(bundle.priceCents / 100).toFixed(0)} {t(locale, "programsPage.usd")}
              </span>
            </div>
          )}
        </div>

        {/* Curriculum */}
        {bundle.modules && bundle.modules.length > 0 && (
          <div className="bg-white border border-gray-200 shadow-sm p-8 md:p-10 mb-8">
            <h2 className="font-serif text-2xl font-bold text-navy mb-6">
              {t(locale, "programDetail.curriculum")}
            </h2>
            <div className="space-y-4">
              {bundle.modules.map((mod: any, i: number) => (
                <div
                  key={mod.id}
                  className="border border-gray-100 p-5 hover:border-gold/30 transition-colors"
                >
                  <h3 className="font-serif text-lg font-semibold text-navy mb-2">
                    Module {i + 1}: {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="text-sm text-gray-500">{mod.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enroll form */}
        <div className="bg-white border border-gray-200 shadow-sm p-8 md:p-10">
          <h2 className="font-serif text-2xl font-bold text-navy mb-6">
            {t(locale, "programDetail.enroll")}
          </h2>
          <form onSubmit={handleEnroll} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(locale, "programDetail.emailPlaceholder")}
              className="flex-1 border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gold"
              disabled={enrollStatus === "loading" || enrollStatus === "enrolled"}
            />
            <button
              type="submit"
              disabled={enrollStatus === "loading" || enrollStatus === "enrolled"}
              className="px-8 py-3 rounded-sm bg-crimson text-white text-sm font-medium hover:bg-crimson-dark disabled:opacity-50 transition-all whitespace-nowrap"
            >
              {enrollStatus === "loading"
                ? "..."
                : enrollStatus === "enrolled"
                ? t(locale, "enrollment.enrolled")
                : t(locale, "programDetail.startLearning")}
            </button>
          </form>
          {enrollMessage && (
            <p
              className={`mt-4 text-sm ${
                enrollStatus === "success" || enrollStatus === "enrolled"
                  ? "text-green-700"
                  : "text-red-600"
              }`}
            >
              {enrollMessage}
            </p>
          )}
        </div>
      </div>

      <div className="text-center pb-16">
        <a
          href={`${prefix}/programs`}
          className="text-gold hover:underline font-serif text-sm"
        >
          {t(locale, "nav.backToPrograms")}
        </a>
      </div>
    </div>
  );
}
