import { useLocale } from "~/lib/LocaleContext";
import { supportedLocales, switchLocalePath, t } from "~/lib/i18n";
import type { Locale } from "~/lib/i18n";
import { useState, useRef, useEffect } from "react";

const flagEmoji: Record<Locale, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
};

const localeLabel: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  es: "ES",
};

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:text-white hover:bg-white/10"
        aria-label={t(locale, "nav.language")}
      >
        <span>{flagEmoji[locale]}</span>
        <span>{localeLabel[locale]}</span>
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] border border-gray-700 bg-navy-lighter shadow-lg">
          {supportedLocales.map((l) => (
            <a
              key={l}
              href={switchLocalePath(currentPath, l)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                l === locale
                  ? "text-gold font-medium"
                  : "text-gray-300"
              }`}
              onClick={() => setOpen(false)}
            >
              <span>{flagEmoji[l]}</span>
              <span>{t(locale, `langSwitch.${l}`)}</span>
              {l === locale && (
                <svg
                  className="ml-auto h-4 w-4 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
