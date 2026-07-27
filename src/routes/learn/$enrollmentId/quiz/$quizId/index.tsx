import { createFileRoute, Link } from "@tanstack/react-router";
import { getQuiz, submitQuiz, getEnrollment } from "~/lib/server";
import { useState } from "react";

export const Route = createFileRoute("/learn/$enrollmentId/quiz/$quizId/")({
  component: QuizPage,
  loader: async ({ params }) => {
    const enrollmentId = parseInt(params.enrollmentId);
    const quizId = parseInt(params.quizId);
    const [quiz, enrollment] = await Promise.all([
      getQuiz({ data: quizId }),
      getEnrollment({ data: enrollmentId }),
    ]);
    if (!quiz || !enrollment) throw new Error("Not found");
    return { quiz, enrollment };
  },
});

function QuizPage() {
  const { quiz, enrollment } = Route.useLoaderData();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await submitQuiz({ data: { enrollmentId: enrollment.id, quizId: quiz.id, answers } });
      setResults(result); setSubmitted(true);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const allAnswered = quiz.questions.every((q: any) => answers[q.id] !== undefined);
  const currentModule = enrollment.modules.find((m: any) => m.quizId === quiz.id);

  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-6 py-10 text-white">
        <div className="max-w-3xl mx-auto">
          <Link to="/learn/$enrollmentId/$moduleId" params={{ enrollmentId: String(enrollment.id), moduleId: String(currentModule?.id ?? enrollment.modules[0]?.id ?? 1) }} className="text-gold/60 hover:text-gold text-sm mb-4 inline-block">← Back to Module</Link>
          <h1 className="font-serif text-3xl font-bold">{quiz.title}</h1>
          <p className="text-gray-400 mt-2">{quiz.questions.length} questions · Passing score: {quiz.passingScore}%</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-10">
        {!submitted ? (
          <>
            <div className="space-y-8">
              {quiz.questions.map((q: any, qi: number) => (
                <div key={q.id} className="bg-white border border-gray-200 p-6">
                  <p className="font-serif text-lg font-semibold text-navy mb-4">{qi + 1}. {q.questionText}</p>
                  <div className="space-y-2">
                    {(q.options as string[]).map((option: string, oi: number) => (
                      <button key={oi} onClick={() => handleSelect(q.id, oi)} className={`w-full text-left px-4 py-3 rounded-sm border text-sm transition-all ${answers[q.id] === oi ? "border-navy bg-navy text-white" : "border-gray-200 hover:border-navy text-gray-700"}`}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>{option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button onClick={handleSubmit} disabled={!allAnswered || loading} className="px-10 py-3 rounded-sm bg-crimson text-white font-medium hover:bg-crimson-dark transition-all disabled:opacity-50">
                {loading ? "Submitting..." : "Submit Quiz"}
              </button>
              {!allAnswered && <p className="text-xs text-gray-500 mt-2">Please answer all questions before submitting.</p>}
            </div>
          </>
        ) : (
          <div>
            <div className={`text-center p-8 mb-8 border ${results.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className="font-serif text-2xl font-bold mb-2">{results.passed ? "🎉 Congratulations!" : "Keep Trying"}</p>
              <p className={`text-4xl font-bold font-serif ${results.passed ? "text-green-700" : "text-red-700"}`}>{results.score}%</p>
              <p className="text-gray-600 mt-2">{results.correct} of {results.total} correct{results.passed ? " — You passed!" : ` — Passing score is ${quiz.passingScore}%`}</p>
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-navy">Review Answers</h2>
              {results.results.map((r: any, ri: number) => (
                <div key={ri} className={`bg-white border p-6 ${r.isCorrect ? "border-green-200" : "border-red-200"}`}>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex-shrink-0 ${r.isCorrect ? "text-green-600" : "text-red-600"}`}>{r.isCorrect ? "✓" : "✗"}</span>
                    <div>
                      <p className="font-medium text-navy mb-2">{ri + 1}. {r.questionText}</p>
                      {!r.isCorrect && (
                        <div className="text-sm space-y-1 mb-3">
                          <p className="text-red-600">Your answer: {r.userAnswer != null ? String.fromCharCode(65 + r.userAnswer) : "Not answered"}</p>
                          <p className="text-green-600">Correct: {String.fromCharCode(65 + r.correctAnswer)}</p>
                        </div>
                      )}
                      {r.explanation && <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-sm">{r.explanation}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center flex gap-4 justify-center">
              <Link to="/learn/$enrollmentId/$moduleId" params={{ enrollmentId: String(enrollment.id), moduleId: String(currentModule?.id ?? enrollment.modules[0]?.id ?? 1) }} className="px-6 py-2.5 rounded-sm border border-gray-300 text-sm text-gray-600 hover:border-navy transition-all">Back to Module</Link>
              {!results.passed && <button onClick={() => { setSubmitted(false); setAnswers({}); setResults(null); }} className="px-6 py-2.5 rounded-sm bg-navy text-white text-sm hover:bg-navy-light transition-all">Retake Quiz</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
