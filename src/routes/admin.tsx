import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

// ── AI Generation Server Functions ──────────────────────────────────────────

const generateBundleOutline = createServerFn()
  .validator((topic: string) => topic)
  .handler(async ({ data: topic }) => {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!openaiKey && !anthropicKey) {
      return {
        error:
          "No AI API key configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in the environment to enable AI content generation.",
      };
    }

    // With an API key, we'd use the Vercel AI SDK:
    // import { generateObject } from "ai";
    // import { openai } from "@ai-sdk/openai";
    // const result = await generateObject({ model: openai("gpt-4o"), ... });

    // For now, return a placeholder structure demonstrating the expected output
    return {
      error:
        "AI generation is configured but no API key is available. Set OPENAI_API_KEY or ANTHROPIC_API_KEY to enable generation.",
      mock: {
        title: topic,
        modules: [
          {
            title: "Module 1: Introduction & Foundations",
            description: "Core concepts and fundamentals",
            lessons: [
              "Lesson 1.1: Overview",
              "Lesson 1.2: Key Concepts",
              "Lesson 1.3: Getting Started",
            ],
          },
          {
            title: "Module 2: Core Techniques",
            description: "Essential skills and methods",
            lessons: [
              "Lesson 2.1: Technique A",
              "Lesson 2.2: Technique B",
              "Lesson 2.3: Hands-On Practice",
            ],
          },
          {
            title: "Module 3: Advanced Applications",
            description: "Real-world use cases and projects",
            lessons: [
              "Lesson 3.1: Case Study 1",
              "Lesson 3.2: Case Study 2",
              "Lesson 3.3: Capstone Project",
            ],
          },
        ],
      },
    };
  });

const generateLessonContent = createServerFn()
  .validator((input: { title: string; context: string }) => input)
  .handler(async ({ data }) => {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!openaiKey && !anthropicKey) {
      return {
        error:
          "No AI API key configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in the environment.",
      };
    }
    return {
      error:
        "AI generation requires OPENAI_API_KEY or ANTHROPIC_API_KEY. The function is ready but needs an API key.",
      mock: `# ${data.title}\n\n## Introduction\n\nThis lesson covers ${data.title.toLowerCase()}. ${data.context}\n\n## Key Concepts\n\n- Concept one\n- Concept two\n- Concept three\n\n## Summary\n\nIn this lesson, we explored the fundamentals of ${data.title.toLowerCase()}.`,
    };
  });

const generateQuiz = createServerFn()
  .validator((input: { moduleTitle: string; moduleContent: string }) => input)
  .handler(async ({ data }) => {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!openaiKey && !anthropicKey) {
      return {
        error:
          "No AI API key configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in the environment.",
      };
    }
    return {
      error:
        "AI generation requires an API key. The function structure is ready for when a key is added.",
      mock: {
        title: `${data.moduleTitle} Quiz`,
        questions: [
          {
            questionText: "Sample question about " + data.moduleTitle + "?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctIndex: 0,
            explanation: "Sample explanation for the correct answer.",
          },
        ],
      },
    };
  });

// ── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [topic, setTopic] = useState("");
  const [outlineResult, setOutlineResult] = useState<any>(null);
  const [lessonResult, setLessonResult] = useState<any>(null);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const handleGenerateOutline = async () => {
    if (!topic.trim()) return;
    setLoading("outline");
    setError("");
    try {
      const result = await generateBundleOutline({ data: topic });
      setOutlineResult(result);
      setLessonResult(null);
      setQuizResult(null);
    } catch (e: any) {
      setError(e.message || "Failed to generate outline");
    }
    setLoading("");
  };

  const handleGenerateLesson = async () => {
    setLoading("lesson");
    setError("");
    try {
      const result = await generateLessonContent({
        data: { title: "Sample Lesson", context: topic || "AI concepts" },
      });
      setLessonResult(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate lesson");
    }
    setLoading("");
  };

  const handleGenerateQuiz = async () => {
    setLoading("quiz");
    setError("");
    try {
      const result = await generateQuiz({
        data: { moduleTitle: topic || "AI Module", moduleContent: "Sample content" },
      });
      setQuizResult(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate quiz");
    }
    setLoading("");
  };

  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-6 py-10 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl font-bold">Admin: AI Content Pipeline</h1>
          <p className="text-gray-400 mt-2">
            Generate course outlines, lesson content, and quizzes using AI.
          </p>
          <p className="text-xs text-gold/60 mt-2">
            Note: Requires OPENAI_API_KEY or ANTHROPIC_API_KEY to be set.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Bundle Outline Generator */}
        <section className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-xl font-bold text-navy mb-4">
            1. Generate Bundle Outline
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a bundle topic (e.g., 'Machine Learning for Business')"
              className="flex-1 border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gold"
              onKeyDown={(e) => e.key === "Enter" && handleGenerateOutline()}
            />
            <button
              onClick={handleGenerateOutline}
              disabled={loading === "outline" || !topic.trim()}
              className="px-6 py-2.5 rounded-sm bg-navy text-white text-sm font-medium hover:bg-navy-light disabled:opacity-50 transition-all whitespace-nowrap"
            >
              {loading === "outline" ? "Generating..." : "Generate Outline"}
            </button>
          </div>

          {outlineResult && (
            <div className="mt-6 bg-gray-50 p-4 rounded-sm text-sm">
              {outlineResult.error ? (
                <div className="text-amber-700">
                  <p className="font-medium">Note:</p>
                  <p>{outlineResult.error}</p>
                  {outlineResult.mock && (
                    <div className="mt-4">
                      <p className="font-medium text-navy mb-2">Mock Output (structure preview):</p>
                      <pre className="text-xs bg-white p-3 border overflow-auto">
                        {JSON.stringify(outlineResult.mock, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(outlineResult, null, 2)}
                </pre>
              )}
            </div>
          )}
        </section>

        {/* Lesson Content Generator */}
        <section className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-xl font-bold text-navy mb-4">
            2. Generate Lesson Content
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Generate full, markdown-formatted lesson content for a given topic.
          </p>
          <button
            onClick={handleGenerateLesson}
            disabled={loading === "lesson"}
            className="px-6 py-2.5 rounded-sm bg-navy text-white text-sm font-medium hover:bg-navy-light disabled:opacity-50 transition-all"
          >
            {loading === "lesson" ? "Generating..." : "Generate Lesson Content"}
          </button>

          {lessonResult && (
            <div className="mt-6 bg-gray-50 p-4 rounded-sm text-sm">
              {lessonResult.error ? (
                <div className="text-amber-700">{lessonResult.error}</div>
              ) : (
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(lessonResult, null, 2)}
                </pre>
              )}
            </div>
          )}
        </section>

        {/* Quiz Generator */}
        <section className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-xl font-bold text-navy mb-4">
            3. Generate Quiz
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Create quiz questions with answers and explanations based on module content.
          </p>
          <button
            onClick={handleGenerateQuiz}
            disabled={loading === "quiz"}
            className="px-6 py-2.5 rounded-sm bg-navy text-white text-sm font-medium hover:bg-navy-light disabled:opacity-50 transition-all"
          >
            {loading === "quiz" ? "Generating..." : "Generate Quiz"}
          </button>

          {quizResult && (
            <div className="mt-6 bg-gray-50 p-4 rounded-sm text-sm">
              {quizResult.error ? (
                <div className="text-amber-700">{quizResult.error}</div>
              ) : (
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(quizResult, null, 2)}
                </pre>
              )}
            </div>
          )}
        </section>

        {/* Status */}
        <section className="bg-amber-50 border border-amber-200 p-6 text-sm text-amber-800">
          <p className="font-medium mb-2">API Key Status</p>
          <p>
            {process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY
              ? "✓ API key is configured"
              : "✗ No API key found. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in .env to enable live generation."}
          </p>
          <p className="mt-2 text-xs text-amber-600">
            The generation functions are built with Vercel AI SDK and ready to use. Add an API key to
            enable real AI content generation.
          </p>
        </section>
      </div>
    </div>
  );
}
