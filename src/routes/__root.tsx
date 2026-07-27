import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { detectLocale } from "~/lib/i18n";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { LocaleProvider } from "~/lib/LocaleContext";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "AI Campus — An Online University for the Age of AI",
      },
      {
        name: "description",
        content:
          "AI Campus offers rigorous online programs in AI, data science, digital marketing, and more. Earn verifiable digital certificates from a prestigious online institution.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap",
      },
    ],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <AppShell />
    </RootDocument>
  );
}

function AppShell() {
  return (
    <LocaleProvider locale="en">
      <NavBar />
      <Outlet />
    </LocaleProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  useEffect(() => {
    const locale = detectLocale(window.location.pathname);
    document.documentElement.lang = locale;
  }, []);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// ── Global Navigation Bar ─────────────────────────────────────────────────────

function NavBar() {
  const prefix =
    typeof window !== "undefined"
      ? (() => {
          const locale = detectLocale(window.location.pathname);
          return locale === "en" ? "" : `/${locale}`;
        })()
      : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a
          href={prefix || "/"}
          className="flex items-center gap-2 font-serif text-lg font-bold text-white transition-colors hover:text-gold"
        >
          <div className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-navy">
            <span className="font-serif text-xs font-bold text-white">AI</span>
          </div>
          <span>AI Campus</span>
        </a>
        <div className="flex items-center gap-4">
          <a
            href={`${prefix}/programs`}
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            Programs
          </a>
          <a
            href="/verify/sample"
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            Certificates
          </a>
          <LanguageSwitcher className="ml-2" />
        </div>
      </div>
    </nav>
  );
}
