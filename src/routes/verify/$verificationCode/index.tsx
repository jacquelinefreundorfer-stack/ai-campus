import { createFileRoute, Link } from "@tanstack/react-router";
import { getCertificateByCode } from "~/lib/server";

export const Route = createFileRoute("/verify/$verificationCode/")({
  component: VerificationPage,
  loader: async ({ params }) => {
    const code = params.verificationCode;
    const cert = await getCertificateByCode({ data: code });
    return { cert, code };
  },
});

function VerificationPage() {
  const { cert, code } = Route.useLoaderData();

  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-6 py-10 text-center text-white">
        <Link to="/" className="text-gold/60 hover:text-gold text-sm mb-4 inline-block">
          ← AI Campus
        </Link>
        <h1 className="font-serif text-3xl font-bold">Certificate Verification</h1>
        <p className="mt-2 text-gray-400 text-sm">
          AI Campus digital credential authentication
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {cert ? (
          <div className="space-y-6">
            {/* Valid status banner */}
            <div className="bg-green-50 border border-green-200 p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="font-serif text-2xl font-bold text-green-800">
                  Verified — AI Campus Digital Certificate
                </h2>
              </div>
              <p className="text-green-700 text-sm">
                This certificate is authentic and was issued by AI Campus.
              </p>
            </div>

            {/* Certificate details */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="border-b border-gray-100 px-8 py-5">
                <h3 className="font-serif text-lg font-bold text-navy">Certificate Details</h3>
              </div>
              <div className="px-8 py-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Student Name</p>
                    <p className="font-serif text-lg font-semibold text-navy">
                      {cert.user?.name || (cert.metadata as any)?.studentName || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Email</p>
                    <p className="text-navy">{cert.user?.email || "—"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Program Completed</p>
                  <p className="font-serif text-lg font-semibold text-navy">
                    {cert.bundle?.title || (cert.metadata as any)?.bundleTitle || "—"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Date Issued</p>
                    <p className="text-navy font-medium">
                      {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Modules</p>
                    <p className="text-navy font-medium">{(cert.metadata as any)?.modulesCompleted || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Hours</p>
                    <p className="text-navy font-medium">{(cert.metadata as any)?.hours || "—"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Status</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    VALID
                  </span>
                </div>

                {(cert.metadata as any)?.competencies && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Competencies Demonstrated</p>
                    <div className="space-y-2">
                      {(cert.metadata as any).competencies.map((comp: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-700">{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Certificate ID: {cert.verificationCode}
                  </p>
                </div>
              </div>
            </div>

            {/* School branding */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-navy">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-navy">
                  <span className="font-serif text-xs font-bold text-white">AI</span>
                </div>
                <span className="font-serif text-sm font-bold">AI Campus</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                An accredited online institution · Verified digital credentials
              </p>
            </div>
          </div>
        ) : (
          /* Certificate not found */
          <div className="bg-white border border-gray-200 p-10 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-200 bg-red-50">
                <svg className="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <h2 className="font-serif text-2xl font-bold text-navy mb-3">
              Certificate Not Found
            </h2>
            <p className="text-gray-600 mb-2">
              The verification code <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{code}</code> does not match any certificate in our system.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              This could mean the certificate is invalid, has been revoked, or the code was entered incorrectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex justify-center rounded-sm bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-light transition-all"
              >
                Return to AI Campus
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
