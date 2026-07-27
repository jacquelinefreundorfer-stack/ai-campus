import { useState, useEffect } from "react";
import { getBundle, getBundleModules, createCheckoutSession, getUserEnrollments } from "~/lib/server";
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
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Check auth state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
          }
        }
      } catch {
        // ignore
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  // Check for existing enrollment
  useEffect(() => {
    if (!user || !bundle) return;
    const checkEnrollment = async () => {
      try {
        const enrollments = await getUserEnrollments();
        const existing = (enrollments as any[]).find((e: any) => e.bundleId === bundle.id);
        if (existing) {
          setEnrollmentId(existing.id);
        }
      } catch {
        // ignore
      }
    };
    checkEnrollment();
  }, [user, bundle]);

  const handleEnroll = async () => {
    setCheckoutLoading(true);
    setError("");
    try {
      const result = await createCheckoutSession({ data: { bundleId: bundle.id } });
      // Redirect to Stripe Checkout
      window.location.href = result.url;
    } catch (e: any) {
      setError(e.message || "Failed to start checkout. Please try again.");
      setCheckoutLoading(false);
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

        {/* Enroll section */}
        <div className="bg-white border border-gray-200 shadow-sm p-8 md:p-10">
          <h2 className="font-serif text-2xl font-bold text-navy mb-6">
            {t(locale, "programDetail.enroll")}
          </h2>
          {enrollmentId ? (
            <div>
              <p className="text-green-700 text-sm mb-4">
                ✓ {t(locale, "programDetail.enrolled")}
              </p>
              <a
                href={`/learn/${enrollmentId}/${bundle.modules?.[0]?.id ?? 1}`}
                className="inline-block px-8 py-3 rounded-sm bg-navy text-white text-sm font-medium hover:bg-navy-light transition-all"
              >
                {t(locale, "programDetail.startLearning")}
              </a>
            </div>
          ) : authLoading ? (
            <div className="py-4 text-center">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          ) : !user ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {t(locale, "programDetail.signInToEnroll")}
              </p>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-auth-modal"));
                }}
                className="px-8 py-3 rounded-sm bg-crimson text-white text-sm font-medium hover:bg-crimson-dark transition-all"
              >
                {locale === "de" ? "Anmelden zum Einschreiben" : locale === "es" ? "Inicia sesión para inscribirte" : "Sign In to Enroll"}
              </button>
            </div>
          ) : (
            <div>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <button
                onClick={handleEnroll}
                disabled={checkoutLoading}
                className="px-8 py-3 rounded-sm bg-crimson text-white text-sm font-medium hover:bg-crimson-dark disabled:opacity-50 transition-all"
              >
                {checkoutLoading
                  ? (locale === "de" ? "Weiterleitung..." : locale === "es" ? "Redirigiendo..." : "Redirecting...")
                  : (locale === "de" ? "Jetzt einschreiben" : locale === "es" ? "Inscríbete ahora" : "Enroll Now")}
              </button>
              <p className="mt-3 text-xs text-gray-400">
                {locale === "de" ? "30-Tage-Geld-zurück-Garantie" : locale === "es" ? "Garantía de devolución de 30 días" : "30-day money-back guarantee"}
              </p>
            </div>
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
