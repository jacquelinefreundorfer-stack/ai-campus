import { Link } from "@tanstack/react-router";
import { getBundles } from "~/lib/server";
import { t } from "~/lib/i18n";
import type { Locale } from "~/lib/i18n";

export function ProgramsPage({ locale }: { locale: Locale }) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  // Note: loaders are route-specific; this component receives data via props
  return null; // We'll use route-level data loading
}

export function ProgramsPageContent({
  locale,
  bundles,
}: {
  locale: Locale;
  bundles: any[];
}) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  if (bundles.length === 0) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center pt-[49px]">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-navy mb-4">
            {t(locale, "programsPage.title")}
          </h1>
          <p className="text-gray-600">{t(locale, "programsPage.noPrograms")}</p>
          <Link to="/" className="mt-6 inline-block text-gold hover:underline">
            {t(locale, "nav.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream pt-[49px]">
      <div className="bg-navy px-6 py-16 text-center text-white">
        <a href={prefix || "/"} className="text-gold/60 hover:text-gold text-sm mb-6 inline-block">
          {t(locale, "nav.backToHome")}
        </a>
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">
          {t(locale, "programsPage.title")}
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
          {t(locale, "programsPage.subtext")}
        </p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {bundles.map((bundle: any) => (
          <div
            key={bundle.id}
            className="bg-white border border-gray-200 shadow-sm p-8 md:p-10"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-widest text-gold mb-2">
                  {bundle.school}
                </p>
                <h2 className="font-serif text-2xl font-bold text-navy mb-3">
                  {bundle.title}
                </h2>
                {bundle.subtitle && (
                  <p className="text-gray-500 mb-3 font-serif italic">
                    {bundle.subtitle}
                  </p>
                )}
                <p className="text-gray-600 leading-relaxed mb-4">
                  {bundle.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    {bundle.modulesCount} {t(locale, "programsPage.modules")}
                  </span>
                  <span>·</span>
                  <span>
                    ~{bundle.hours} {t(locale, "programsPage.hours")}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 min-w-[200px]">
                {bundle.launchPriceCents ? (
                  <div>
                    <span className="font-serif text-2xl font-bold text-navy">
                      ${(bundle.launchPriceCents / 100).toFixed(0)} {t(locale, "programsPage.usd")}
                    </span>
                    <span className="ml-2 text-base text-gray-400 line-through">
                      ${(bundle.priceCents / 100).toFixed(0)} {t(locale, "programsPage.usd")}
                    </span>
                  </div>
                ) : (
                  <span className="font-serif text-2xl font-bold text-navy">
                    ${(bundle.priceCents / 100).toFixed(0)} {t(locale, "programsPage.usd")}
                  </span>
                )}
                <a
                  href={`${prefix}/programs/${bundle.id}`}
                  className="w-full inline-flex justify-center rounded-sm bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-all"
                >
                  {t(locale, "programsPage.viewProgram")}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center pb-16">
        <a href={prefix || "/"} className="text-gold hover:underline font-serif text-sm">
          {t(locale, "nav.returnHome")}
        </a>
      </div>
    </div>
  );
}
