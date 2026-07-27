import { createFileRoute, Link } from "@tanstack/react-router";
import { getBundle, getBundleModules, enrollInBundle } from "~/lib/server";
import { useState, useEffect } from "react";
import { AuthModal } from "~/components/AuthModal";

export const Route = createFileRoute("/programs/")({
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
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
        setCheckingAuth(false);
      })
      .catch(() => setCheckingAuth(false));
  }, []);

  const handleEnroll = async () => {
    setStatus("loading");
    setError("");
    try {
      const enrollment = await enrollInBundle({
        data: { bundleId: bundle.id },
      });
      setEnrollmentId(enrollment.id);
      setStatus("done");
    } catch (e: any) {
      setError(e.message || "Enrollment failed.");
      setStatus("idle");
    }
  };

  return (
    <>
      <div className="min-h-dvh bg-cream">
        <div className="bg-navy px-6 py-16 text-white">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/programs"
              className="text-gold/60 hover:text-gold text-sm mb-6 inline-block"
            >
              ← All Programs
            </Link>
            <p className="text-xs font-medium uppercase tracking-widest text-gold mb-2">
              {bundle.school}
            </p>
            <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-4">
              {bundle.title}
            </h1>
            {bundle.subtitle && (
              <p className="text-xl text-gray-300 font-serif italic">
                {bundle.subtitle}
              </p>
            )}
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-400">
              <span>{bundle.modulesCount} modules</span>
              <span>·</span>
              <span>~{bundle.hours} hours</span>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                About This Program
              </h2>
              <p className="text-gray-600 leading-relaxed mb-10">
                {bundle.description}
              </p>
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                Curriculum
              </h2>
              <div className="space-y-4">
                {modules.map((mod: any) => (
                  <div
                    key={mod.id}
                    className="bg-white border border-gray-200 p-5"
                  >
                    <h3 className="font-serif text-lg font-semibold text-navy">
                      Module {mod.sortOrder}: {mod.title}
                    </h3>
                    {mod.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {mod.description}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-gray-400">
                      {mod.lessons.length} lessons
                      {mod.quizId && <span> · Quiz included</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 p-6 sticky top-6">
                <div className="mb-4">
                  {bundle.launchPriceCents ? (
                    <div>
                      <span className="font-serif text-3xl font-bold text-navy">
                        ${(bundle.launchPriceCents / 100).toFixed(0)} USD
                      </span>
                      <span className="ml-2 text-gray-400 line-through">
                        ${(bundle.priceCents / 100).toFixed(0)} USD
                      </span>
                    </div>
                  ) : (
                    <span className="font-serif text-3xl font-bold text-navy">
                      ${(bundle.priceCents / 100).toFixed(0)} USD
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    One-time payment · Lifetime access
                  </p>
                </div>
                {status === "done" && enrollmentId ? (
                  <div className="space-y-3">
                    <p className="text-green-700 font-medium text-sm">
                      ✓ Enrolled!
                    </p>
                    <Link
                      to="/learn/$enrollmentId/$moduleId"
                      params={{
                        enrollmentId: String(enrollmentId),
                        moduleId: String(modules[0]?.id ?? 1),
                      }}
                      className="block w-full text-center rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light"
                    >
                      Start Learning
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {error && (
                      <p className="text-red-600 text-xs">{error}</p>
                    )}
                    {checkingAuth ? (
                      <button
                        disabled
                        className="w-full rounded-sm bg-gray-300 px-6 py-3 text-sm font-medium text-gray-500"
                      >
                        Loading...
                      </button>
                    ) : user ? (
                      <button
                        onClick={handleEnroll}
                        disabled={status === "loading"}
                        className="w-full rounded-sm bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark disabled:opacity-60"
                      >
                        {status === "loading"
                          ? "Enrolling..."
                          : "Enroll Now"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setAuthModalOpen(true)}
                        className="w-full rounded-sm bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark"
                      >
                        Sign In to Enroll
                      </button>
                    )}
                    <p className="text-xs text-gray-400 text-center">
                      30-day money-back guarantee
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}
