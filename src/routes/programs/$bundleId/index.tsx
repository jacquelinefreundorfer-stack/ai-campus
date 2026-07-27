import { createFileRoute, Link } from "@tanstack/react-router";
import { getBundle, getBundleModules, enrollInBundle, getUserEnrollments } from "~/lib/server";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/programs/$bundleId/")({
  component: BundleDetailPage,
  loader: async ({ params }) => {
    const id = parseInt(params.bundleId);
    const bundle = await getBundle({ data: id });
    if (!bundle) throw new Error("Bundle not found");
    const modulesWithLessons = await getBundleModules({ data: id });
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
      // Redirect to lesson player
      window.location.href = `/learn/${enrId}/${firstModuleId}`;
    } catch (e: any) {
      setError(e.message || "Failed to enroll. Please try again.");
      setEnrolling(false);
    }
  };

  const price = bundle.launchPriceCents ?? bundle.priceCents;
  const originalPrice = bundle.launchPriceCents ? bundle.priceCents : null;

  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-6 py-16 text-white">
        <div className="max-w-5xl mx-auto">
          <Link to="/programs" className="text-gold/60 hover:text-gold text-sm mb-6 inline-block">← All Programs</Link>
          <p className="text-xs font-medium uppercase tracking-widest text-gold mb-2">{bundle.school}</p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-4">{bundle.title}</h1>
          {bundle.subtitle && <p className="text-xl text-gray-300 font-serif italic">{bundle.subtitle}</p>}
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-400"><span>{bundle.modulesCount} modules</span><span>·</span><span>~{bundle.hours} hours</span></div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-navy mb-4">About This Program</h2>
            <p className="text-gray-600 leading-relaxed mb-10">{bundle.description}</p>
            <h2 className="font-serif text-2xl font-bold text-navy mb-6">Curriculum</h2>
            <div className="space-y-4">
              {modules.map((mod: any) => (
                <div key={mod.id} className="bg-white border border-gray-200 p-5">
                  <h3 className="font-serif text-lg font-semibold text-navy">Module {mod.sortOrder}: {mod.title}</h3>
                  {mod.description && <p className="text-sm text-gray-500 mt-1">{mod.description}</p>}
                  <div className="mt-2 text-xs text-gray-400">{mod.lessons.length} lessons{mod.quizId && <span> · Quiz included</span>}</div>
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
                <p className="text-sm text-gray-500 mt-1">One-time payment · Lifetime access</p>
              </div>

              {enrollmentId ? (
                <div className="space-y-3">
                  <p className="text-green-700 font-medium text-sm">✓ Enrolled!</p>
                  <Link
                    to="/learn/$enrollmentId/$moduleId"
                    params={{ enrollmentId: String(enrollmentId), moduleId: String(modules[0]?.id ?? 1) }}
                    className="block w-full text-center rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light"
                  >
                    Start Learning
                  </Link>
                </div>
              ) : authLoading ? (
                <div className="py-8 text-center">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                </div>
              ) : !user ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 text-center">Sign in to enroll in this program.</p>
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("open-auth-modal"));
                    }}
                    className="w-full rounded-sm bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark"
                  >
                    Sign In to Enroll
                  </button>
                  <p className="text-xs text-gray-400 text-center">Beta cohort: complimentary enrollment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {error && <p className="text-red-600 text-xs">{error}</p>}
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full rounded-sm bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark disabled:opacity-60"
                  >
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                  </button>
                  <p className="text-xs text-gray-400 text-center">Beta cohort: complimentary enrollment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
