import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/verify/sample")({
  component: SampleVerificationPage,
});

function SampleVerificationPage() {
  const sampleData = {
    studentName: "Jane Smith",
    programTitle: "AI & Generative AI Practitioner",
    dateIssued: "January 15, 2026",
    modulesCompleted: 8,
    hours: 25,
    competencies: [
      "Foundations of Prompt Engineering",
      "Building and Orchestrating AI Agents",
      "Custom GPTs and Model Fine-Tuning",
      "LLM Application Development",
      "Retrieval-Augmented Generation (RAG)",
      "AI Ethics, Safety & Governance",
    ],
    verificationCode: "sample-demo-code-12345",
  };

  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-6 py-10 text-center text-white">
        <Link to="/" className="text-gold/60 hover:text-gold text-sm mb-4 inline-block">
          ← AI Campus
        </Link>
        <h1 className="font-serif text-3xl font-bold">Certificate Verification (Sample)</h1>
        <p className="mt-2 text-gray-400 text-sm">
          This is a demonstration of the AI Campus digital credential verification system
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Valid status banner */}
        <div className="bg-green-50 border border-green-200 p-6 text-center mb-6">
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

        {/* Sample notice */}
        <div className="bg-amber-50 border border-amber-200 p-4 text-center mb-6">
          <p className="text-amber-800 text-sm">
            ⚠ This is a sample/demonstration certificate. In production, each certificate receives a unique verification code that links to a dedicated page like this one.
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
                <p className="font-serif text-lg font-semibold text-navy">{sampleData.studentName}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Email</p>
                <p className="text-navy">jane.smith@example.com</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Program Completed</p>
              <p className="font-serif text-lg font-semibold text-navy">{sampleData.programTitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Date Issued</p>
                <p className="text-navy font-medium">{sampleData.dateIssued}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Modules</p>
                <p className="text-navy font-medium">{sampleData.modulesCompleted}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Hours</p>
                <p className="text-navy font-medium">{sampleData.hours}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                VALID
              </span>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Competencies Demonstrated</p>
              <div className="space-y-2">
                {sampleData.competencies.map((comp: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-500">
            Ready to earn your own verifiable certificate?
          </p>
          <Link
            to="/"
            className="inline-flex justify-center rounded-sm bg-crimson px-8 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-all"
          >
            Explore Programs
          </Link>
        </div>
      </div>
    </div>
  );
}
