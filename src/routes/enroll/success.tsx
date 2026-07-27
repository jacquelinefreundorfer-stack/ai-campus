import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fulfillEnrollment, getBundleModules } from "~/lib/server";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/enroll/success")({
  component: EnrollSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: (search.session_id as string) || "",
  }),
});

function EnrollSuccessPage() {
  const { session_id } = Route.useSearch();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!session_id) {
      setStatus("error");
      setErrorMsg("No session ID provided. Please try enrolling again.");
      return;
    }

    let cancelled = false;

    const fulfill = async () => {
      try {
        const result = await fulfillEnrollment({ data: { sessionId: session_id } });

        if (cancelled) return;

        // Get the first module to redirect to the lesson player
        const modules = await getBundleModules({ data: result.bundleId });
        const firstModuleId = modules[0]?.id ?? 1;

        setStatus("success");

        // Redirect to lesson player after a brief pause
        setTimeout(() => {
          navigate({
            to: "/learn/$enrollmentId/$moduleId",
            params: {
              enrollmentId: String(result.enrollmentId),
              moduleId: String(firstModuleId),
            },
          });
        }, 1500);
      } catch (e: any) {
        if (cancelled) return;
        setStatus("error");
        setErrorMsg(e.message || "Failed to verify payment. Please contact support.");
      }
    };

    fulfill();

    return () => {
      cancelled = true;
    };
  }, [session_id]);

  return (
    <div className="min-h-dvh bg-cream flex items-center justify-center px-6 pt-20">
      <div className="max-w-md w-full text-center">
        {status === "verifying" && (
          <div className="bg-white border border-gray-200 p-10">
            <div className="mb-6">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-navy mb-3">
              Verifying Your Payment
            </h1>
            <p className="text-gray-500 text-sm">
              Please wait while we confirm your enrollment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-white border border-gray-200 p-10">
            <div className="mb-6 text-4xl">✅</div>
            <h1 className="font-serif text-2xl font-bold text-navy mb-3">
              Enrollment Complete!
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Your payment was successful. Redirecting you to your course...
            </p>
            <div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full animate-progress rounded-full bg-gold" />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white border border-red-200 p-10">
            <div className="mb-6 text-4xl">❌</div>
            <h1 className="font-serif text-2xl font-bold text-navy mb-3">
              Something Went Wrong
            </h1>
            <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
            <a
              href="/programs"
              className="inline-block rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light"
            >
              Browse Programs
            </a>
          </div>
        )}
      </div>

      {/* Custom animation for the progress bar */}
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
