import { createFileRoute, Link } from "@tanstack/react-router";
import { getCertificate, checkAndIssueCertificate, getEnrollment } from "~/lib/server";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/certificate/$enrollmentId/")({
  component: CertificatePage,
  loader: async ({ params }) => {
    const enrollmentId = parseInt(params.enrollmentId);
    let cert = await getCertificate({ data: enrollmentId });
    const enrollment = await getEnrollment({ data: enrollmentId });
    return { cert, enrollment, enrollmentId };
  },
});

function CertificatePage() {

  // ── Auth guard ──────────────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setAuthUser(data.user);
        setAuthLoading(false);
      })
      .catch(() => setAuthLoading(false));
  }, []);
  if (authLoading) {
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
  if (!authUser) {
    return (
      <div className="min-h-dvh bg-cream pt-20">
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-gold/40 bg-navy mx-auto mb-6">
            <span className="font-serif text-2xl font-bold text-white">AI</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-navy mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-500 mb-8">
            Please sign in to access this page.
          </p>
          <a
            href="/"
            className="inline-block rounded-sm bg-crimson px-8 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-all"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }
  const { cert: initialCert, enrollment, enrollmentId } = Route.useLoaderData();
  const [cert, setCert] = useState(initialCert);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState("");

  const handleIssue = async () => {
    setIssuing(true);
    setError("");
    try {
      const result = await checkAndIssueCertificate({ data: enrollmentId });
      if (result?.issued) {
        // Re-fetch the certificate
        const updatedCert = await getCertificate({ data: enrollmentId });
        setCert(updatedCert);
      } else {
        setError("Certificate requirements not yet met. Complete all lessons and pass all quizzes.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to issue certificate.");
    }
    setIssuing(false);
  };

  // Calculate progress
  const totalLessons = enrollment?.modules?.flatMap((m: any) => m.lessons).length ?? 0;
  const completedLessons = enrollment?.progress?.filter((p: any) => p.completed).length ?? 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (!enrollment) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-navy mb-4">Enrollment Not Found</h1>
          <p className="text-gray-600 mb-6">The enrollment you're looking for doesn't exist.</p>
          <Link to="/" className="text-gold hover:underline">← Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-6 py-16 text-center text-white">
        <Link to="/" className="text-gold/60 hover:text-gold text-sm mb-6 inline-block">← Back to AI Campus</Link>
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">Your Certificate</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
          {cert ? "Congratulations on completing your program!" : "Track your progress toward certification."}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {cert ? (
          /* Certificate earned */
          <div className="space-y-8">
            {/* Certificate preview card */}
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
                <p className="mb-1 font-serif text-xs uppercase tracking-[0.25em] text-gray-500">Digital Certificate of Completion</p>
                <p className="mb-1 font-serif text-sm text-gray-400 italic">This certifies that</p>
                <p className="mb-4 font-serif text-2xl font-bold text-navy">{(cert.metadata as any)?.studentName || "Student"}</p>
                <p className="mb-1 font-serif text-sm text-gray-400 italic">has successfully completed the program</p>
                <p className="mb-5 font-serif text-lg font-semibold text-navy">{(cert.metadata as any)?.bundleTitle || "Program"}</p>

                <div className="mb-5 flex justify-center gap-5 text-xs tracking-wide text-gray-500">
                  <span>{(cert.metadata as any)?.modulesCompleted || 0} Modules</span>
                  <span className="text-gold">·</span>
                  <span>{(cert.metadata as any)?.hours || 0} Hours</span>
                  <span className="text-gold">·</span>
                  <span>Skills Verified</span>
                </div>

                {(cert.metadata as any)?.competencies && (
                  <div className="mb-4 text-left px-4">
                    <p className="font-serif text-xs font-semibold uppercase tracking-wider text-navy mb-2">Competencies Verified</p>
                    <ul className="space-y-1">
                      {(cert.metadata as any).competencies.map((comp: string, i: number) => (
                        <li key={i} className="text-xs text-gray-600">— {comp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-3 text-xs text-gray-500">
                  Issued: {new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>

                <div className="mx-auto mb-2 h-16 w-16 border border-gray-300 bg-white p-1">
                  <div className="grid h-full w-full grid-cols-5 gap-px">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={Math.random() > 0.45 ? "bg-navy" : "bg-white"} />
                    ))}
                  </div>
                </div>
                <p className="font-sans text-[10px] tracking-wide text-gray-400">
                  Verify: aicampus.ctonew.app/verify/{cert.verificationCode?.substring(0, 8)}...
                </p>
              </div>

              <div className="mt-5 text-center">
                <div className="mx-auto h-px w-20 bg-navy/80" />
                <div className="mx-auto mt-1.5 h-px w-12 bg-crimson/60" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`/api/certificate/${enrollmentId}/download`}
                className="inline-flex justify-center rounded-sm bg-navy px-8 py-3.5 text-sm font-medium text-white hover:bg-navy-light transition-all"
                download
              >
                Download PDF Certificate
              </a>
              <Link
                to="/verify/$verificationCode"
                params={{ verificationCode: cert.verificationCode }}
                className="inline-flex justify-center rounded-sm border border-gray-300 px-8 py-3.5 text-sm font-medium text-gray-600 hover:border-navy hover:text-navy transition-all"
              >
                View Public Verification Page
              </Link>
            </div>
          </div>
        ) : (
          /* Progress toward certificate */
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/30 bg-gold-pale">
                  <svg className="h-10 w-10 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-3">Certificate Not Yet Earned</h2>
              <p className="text-gray-600 mb-2">
                Complete all lessons and pass all quizzes in your program to earn your certificate.
              </p>

              {/* Progress bar */}
              <div className="max-w-md mx-auto mt-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{completedLessons} of {totalLessons} lessons complete</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {enrollment && (
                <div className="mt-6">
                  <Link
                    to="/learn/$enrollmentId/$moduleId"
                    params={{
                      enrollmentId: String(enrollmentId),
                      moduleId: String(enrollment.modules?.[0]?.id ?? 1),
                    }}
                    className="inline-flex justify-center rounded-sm bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-all"
                  >
                    Continue Learning
                  </Link>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleIssue}
                  disabled={issuing || progressPercent < 100}
                  className="text-sm text-gold hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  {issuing ? "Checking requirements..." : "Check if I qualify"}
                </button>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
