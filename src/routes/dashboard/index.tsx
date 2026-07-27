import { createFileRoute, Link } from "@tanstack/react-router";
import { getUserEnrollments } from "~/lib/server";
import { useEffect, useState } from "react";
import { AuthModal } from "~/components/AuthModal";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const sessionRes = await fetch("/api/auth/session");
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        if (sessionData?.user) {
          setUser(sessionData.user);
          try {
            const data = await getUserEnrollments();
            setEnrollments(data);
          } catch {
            // ignore
          }
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center border-2 border-gold/40 bg-navy mx-auto mb-4">
            <span className="font-serif text-lg font-bold text-white">AI</span>
          </div>
          <p className="text-gray-500 font-serif">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-dvh bg-cream pt-20">
          <div className="max-w-lg mx-auto px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-gold/40 bg-navy mx-auto mb-6">
              <span className="font-serif text-2xl font-bold text-white">AI</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-navy mb-4">
              Sign In to View Your Dashboard
            </h1>
            <p className="text-gray-500 mb-8">
              Track your programs, progress, and certificates in one place.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-sm bg-crimson px-8 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      </>
    );
  }

  const activeEnrollments = enrollments.filter((e) => e.status === "active");
  const completedEnrollments = enrollments.filter(
    (e) => e.status === "completed" || e.hasCertificate,
  );
  const certificates = enrollments.filter((e) => e.hasCertificate);

  return (
    <div className="min-h-dvh bg-cream pt-20">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-bold text-navy">
            Welcome, {user.name || user.email}
          </h1>
          <p className="text-gray-500 mt-2">Your learning dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-gray-200 p-5 text-center">
            <p className="text-2xl font-bold font-serif text-navy">
              {enrollments.length}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              Programs Enrolled
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-5 text-center">
            <p className="text-2xl font-bold font-serif text-navy">
              {completedEnrollments.length}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              Completed
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-5 text-center">
            <p className="text-2xl font-bold font-serif text-navy">
              {certificates.length}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              Certificates Earned
            </p>
          </div>
        </div>

        {/* My Programs */}
        <h2 className="font-serif text-xl font-bold text-navy mb-6">
          My Programs
        </h2>

        {enrollments.length === 0 ? (
          <div className="bg-white border border-gray-200 p-10 text-center">
            <p className="text-gray-500 mb-4">
              You haven&apos;t enrolled in any programs yet.
            </p>
            <Link
              to="/programs"
              className="inline-block rounded-sm bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-light transition-all"
            >
              Browse Programs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enr: any) => (
              <div
                key={enr.id}
                className="bg-white border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg font-semibold text-navy truncate">
                    {enr.bundle?.title || "Program"}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                        enr.status === "completed" || enr.hasCertificate
                          ? "bg-green-50 text-green-700"
                          : "bg-gold-pale text-navy"
                      }`}
                    >
                      {enr.status === "completed" || enr.hasCertificate
                        ? "Completed"
                        : "Active"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Enrolled{" "}
                      {new Date(enr.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-xs">
                      <div
                        className="h-full bg-gold rounded-full transition-all"
                        style={{
                          width: `${enr.progressPercent || 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {enr.progressPercent || 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {enr.hasCertificate ? (
                    <Link
                      to="/certificate/$enrollmentId"
                      params={{ enrollmentId: String(enr.id) }}
                      className="rounded-sm border border-gold/40 px-4 py-2 text-sm font-medium text-gold hover:bg-gold-pale transition-all whitespace-nowrap"
                    >
                      View Certificate
                    </Link>
                  ) : null}
                  <Link
                    to="/learn/$enrollmentId/$moduleId"
                    params={{
                      enrollmentId: String(enr.id),
                      moduleId: "1",
                    }}
                    className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light transition-all whitespace-nowrap"
                  >
                    {enr.status === "completed" ? "Review" : "Continue"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificates section */}
        {certificates.length > 0 && (
          <>
            <h2 className="font-serif text-xl font-bold text-navy mb-6 mt-12">
              My Certificates
            </h2>
            <div className="space-y-4">
              {certificates.map((enr: any) => (
                <div
                  key={enr.id}
                  className="bg-white border border-gray-200 p-5 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-navy">
                      {enr.bundle?.title || "Program"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Completed{" "}
                      {enr.completedAt
                        ? new Date(enr.completedAt).toLocaleDateString()
                        : "recently"}
                    </p>
                  </div>
                  <Link
                    to="/certificate/$enrollmentId"
                    params={{ enrollmentId: String(enr.id) }}
                    className="rounded-sm border border-navy px-4 py-2 text-sm font-medium text-navy hover:bg-navy hover:text-white transition-all whitespace-nowrap"
                  >
                    View & Download
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
