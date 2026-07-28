import { createFileRoute, Link } from "@tanstack/react-router";
import { getBundleBySlug, getBundleModules, enrollInBundle, getUserEnrollments } from "~/lib/server";
import { useState, useEffect } from "react";
import { jsonLdCourse, buildOgTags } from "~/lib/seo";

const SITE_URL = "https://aicampus.ctonew.app";

export const Route = createFileRoute("/de/programs/$slug/")({
  component: BundleDetailPage,
  head: ({ loaderData }) => {
    const data = loaderData as any;
    const bundle = data?.bundle;
    if (!bundle) return { meta: [{ title: "Programm — AI Campus" }] };

    const ogTags = buildOgTags({
      title: `${bundle.title} — AI Campus`,
      description: bundle.description || "",
      url: `${SITE_URL}/de/programs/${bundle.slug}`,
      type: "website",
    });

    return {
      meta: [
        { title: `${bundle.title} — AI Campus` },
        { name: "description", content: bundle.description || "" },
        ...ogTags,
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLdCourse(bundle)),
        },
      ],
    };
  },
  loader: async ({ params }) => {
    const bundle = await getBundleBySlug({ data: params.slug });
    if (!bundle) throw new Error("Bundle not found");
    const modulesWithLessons = await getBundleModules({ data: bundle.id });
    return { bundle, modules: modulesWithLessons };
  },
});

function BundleDetailPage() {
  const { bundle, modules } = Route.useLoaderData();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (!user) return;
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
  }, [user, bundle.id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError("");
    try {
      const result = await enrollInBundle({ data: { bundleId: bundle.id } });
      const enrId = result.id;
      const firstModuleId = modules[0]?.id ?? 1;
      window.location.href = `/learn/${enrId}/${firstModuleId}`;
    } catch (e: any) {
      setError(e.message || "Einschreibung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      setEnrolling(false);
    }
  };

  const price = bundle.launchPriceCents ?? bundle.priceCents;
  const originalPrice = bundle.launchPriceCents ? bundle.priceCents : null;

  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-6 py-16 text-white">
        <div className="max-w-5xl mx-auto">
          <Link to="/de/programs" className="text-gold/60 hover:text-gold text-sm mb-6 inline-block">← Alle Programme</Link>
          <p className="text-xs font-medium uppercase tracking-widest text-gold mb-2">{bundle.school}</p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-4">{bundle.title}</h1>
          {bundle.subtitle && <p className="text-xl text-gray-300 font-serif italic">{bundle.subtitle}</p>}
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-400"><span>{bundle.modulesCount} Module</span><span>·</span><span>~{bundle.hours} Stunden</span></div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-navy mb-4">Über dieses Programm</h2>
            <p className="text-gray-600 leading-relaxed mb-10">{bundle.description}</p>
            <h2 className="font-serif text-2xl font-bold text-navy mb-6">Lehrplan</h2>
            <div className="space-y-4">
              {modules.map((mod: any) => (
                <div key={mod.id} className="bg-white border border-gray-200 p-5">
                  <h3 className="font-serif text-lg font-semibold text-navy">Modul {mod.sortOrder}: {mod.title}</h3>
                  {mod.description && <p className="text-sm text-gray-500 mt-1">{mod.description}</p>}
                  <div className="mt-2 text-xs text-gray-400">{mod.lessons.length} Lektionen{mod.quizId && <span> · Quiz inklusive</span>}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-6">
              <div className="mb-4">
                {originalPrice ? (
                  <div>
                    <span className="font-serif text-3xl font-bold text-navy">${(price / 100).toFixed(0)} USD</span>
                    <span className="ml-2 text-gray-400 line-through">${(originalPrice / 100).toFixed(0)} USD</span>
                  </div>
                ) : (
                  <span className="font-serif text-3xl font-bold text-navy">${(price / 100).toFixed(0)} USD</span>
                )}
                <p className="text-sm text-gray-500 mt-1">Einmalzahlung · Lebenslanger Zugriff</p>
              </div>
              {enrollmentId ? (
                <div className="space-y-3">
                  <p className="text-green-700 font-medium text-sm">✓ Eingeschrieben!</p>
                  <Link
                    to="/learn/$enrollmentId/$moduleId"
                    params={{ enrollmentId: String(enrollmentId), moduleId: String(modules[0]?.id ?? 1) }}
                    className="block w-full text-center rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light"
                  >
                    Lernen starten
                  </Link>
                </div>
              ) : authLoading ? (
                <div className="py-8 text-center">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                </div>
              ) : !user ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 text-center">Melden Sie sich an, um sich einzuschreiben.</p>
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("open-auth-modal"));
                    }}
                    className="w-full rounded-sm bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark"
                  >
                    Anmelden & Einschreiben
                  </button>
                  <p className="text-xs text-gray-400 text-center">Beta-Kohorte: kostenlose Einschreibung</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {error && <p className="text-red-600 text-xs">{error}</p>}
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full rounded-sm bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark disabled:opacity-60"
                  >
                    {enrolling ? "Wird eingeschrieben..." : "Jetzt einschreiben"}
                  </button>
                  <p className="text-xs text-gray-400 text-center">Beta-Kohorte: kostenlose Einschreibung</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
