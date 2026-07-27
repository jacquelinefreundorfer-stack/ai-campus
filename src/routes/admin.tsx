import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { createBlogPost } from "~/lib/server";

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

// ── Blog: Generate post ──────────────────────────────────────────────────

const generateBlogPost = createServerFn()
  .validator((input: { topic: string }) => input)
  .handler(async ({ data }) => {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!openaiKey && !anthropicKey) {
      return {
        error:
          "No AI API key configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in the environment.",
        mock: generateMockBlogPost(data.topic),
      };
    }
    // With an API key, would use the Vercel AI SDK similarly to other generators
    return {
      error:
        "AI generation requires an API key. The function structure is ready for when a key is added.",
      mock: generateMockBlogPost(data.topic),
    };
  });

function generateMockBlogPost(topic: string) {
  const slug = topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return {
    title: topic,
    slug,
    excerpt: `A comprehensive guide to ${topic.toLowerCase()} — practical insights and actionable strategies for professionals.`,
    content: `## Introduction\n\n${topic} is one of the most important topics in today's rapidly evolving professional landscape. In this article, we explore the key concepts, practical applications, and strategies that professionals need to know.\n\n## Why This Matters\n\nThe world of work is changing at an unprecedented pace. Organizations that embrace ${topic.toLowerCase()} gain a significant competitive advantage, while professionals who develop these skills position themselves for career advancement.\n\n## Key Concepts\n\n- **Foundation**: Understanding the core principles of ${topic.toLowerCase()} is essential before diving into advanced applications.\n- **Practical Application**: Theory alone is not enough. The most successful professionals apply these concepts in real-world scenarios.\n- **Continuous Learning**: The field evolves rapidly. Staying current requires ongoing education and practice.\n\n## Getting Started\n\n1. Begin with a solid foundation by understanding the fundamentals\n2. Apply your knowledge to small, manageable projects\n3. Seek feedback and iterate on your approach\n4. Connect with other professionals in the field\n\n## Next Steps\n\nReady to take your skills to the next level? AI Campus offers comprehensive programs that combine rigorous curriculum with practical, hands-on learning. Our expert-reviewed courses help you master the skills that matter most.\n\n> "The best investment you can make is in your own education." — AI Campus Faculty`,
    author: "AI Campus",
  };
}

// ── Email: Server functions that return prepared content ──────────────────

const prepareWelcomeEmail = createServerFn()
  .validator((input: { email: string; name: string }) => input)
  .handler(async ({ data }) => {
    return {
      success: true,
      message: `Welcome email prepared for ${data.email}.`,
      email: {
        to: data.email,
        subject: "Welcome to AI Campus",
        body: `Dear ${data.name || "Student"},\n\nWelcome to AI Campus! You are now part of an institution dedicated to rigorous, practical education for the age of artificial intelligence.\n\nBrowse our programs: https://aicampus.ctonew.app/programs\n\n— AI Campus`,
      },
    };
  });

const prepareBlogDigest = createServerFn()
  .validator((input: { email: string }) => input)
  .handler(async ({ data }) => {
    const d = (await import("~/db/index")).db();
    const { blogPosts: bp } = await import("~/db/schema");
    const { desc, eq } = await import("drizzle-orm");
    const posts = await d
      .select()
      .from(bp)
      .where(eq(bp.isPublished, true))
      .orderBy(desc(bp.publishedAt))
      .limit(3);
    return {
      success: true,
      message: `Blog digest prepared for ${data.email} with ${posts.length} posts.`,
      email: {
        to: data.email,
        subject: "Latest from AI Campus Journal",
        body: `AI Campus Journal Digest\n\nLatest articles:\n${posts.map((p: any) => `- ${p.title}: https://aicampus.ctonew.app/blog/${p.slug}`).join("\n")}\n\nBrowse programs: https://aicampus.ctonew.app/programs`,
      },
      postCount: posts.length,
    };
  });

const prepareBlogDigestForWaitlist = createServerFn().handler(async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const d = (await import("~/db/index")).db();
  const { blogPosts: bp } = await import("~/db/schema");
  const { desc, eq } = await import("drizzle-orm");
  const posts = await d
    .select()
    .from(bp)
    .where(eq(bp.isPublished, true))
    .orderBy(desc(bp.publishedAt))
    .limit(3);

  let waitlistEmails: string[] = [];
  try {
    const raw = await readFile(join(process.cwd(), "waitlist.json"), "utf8");
    const entries: { email: string; timestamp: string }[] = JSON.parse(raw);
    waitlistEmails = entries.map((e) => e.email);
  } catch {}

  return {
    success: true,
    message: `Digest prepared for ${waitlistEmails.length} waitlisters.`,
    recipientCount: waitlistEmails.length,
    recipients: waitlistEmails,
    postCount: posts.length,
    postSlugs: posts.map((p: any) => p.slug),
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
  const [activeTab, setActiveTab] = useState<"content" | "blog" | "email">("content");

  // ── Blog state ──
  const [blogTopic, setBlogTopic] = useState("");
  const [blogResult, setBlogResult] = useState<any>(null);
  const [publishMsg, setPublishMsg] = useState("");

  // ── Email state ──
  const [welcomeEmail, setWelcomeEmail] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [welcomeResult, setWelcomeResult] = useState<any>(null);
  const [digestEmail, setDigestEmail] = useState("");
  const [digestResult, setDigestResult] = useState<any>(null);
  const [waitlistResult, setWaitlistResult] = useState<any>(null);

  // ── Existing handlers ──

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

  // ── Blog handlers ──

  const handleGenerateBlog = async () => {
    if (!blogTopic.trim()) return;
    setLoading("blog");
    setError("");
    setPublishMsg("");
    try {
      const result = await generateBlogPost({ data: { topic: blogTopic } });
      setBlogResult(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate blog post");
    }
    setLoading("");
  };

  const handlePublishBlog = async () => {
    if (!blogResult?.mock) return;
    const mock = blogResult.mock;
    setLoading("publish");
    setError("");
    try {
      await createBlogPost({
        data: {
          title: mock.title,
          slug: mock.slug,
          content: mock.content,
          excerpt: mock.excerpt,
          author: mock.author || "AI Campus",
          isPublished: true,
        },
      });
      setPublishMsg(`Blog post "${mock.title}" published successfully!`);
      setBlogResult(null);
      setBlogTopic("");
    } catch (e: any) {
      setError(e.message || "Failed to publish blog post");
    }
    setLoading("");
  };

  // ── Email handlers ──

  const handleWelcomeEmail = async () => {
    if (!welcomeEmail.trim()) return;
    setLoading("welcome");
    setError("");
    try {
      const result = await prepareWelcomeEmail({ data: { email: welcomeEmail, name: welcomeName } });
      setWelcomeResult(result);
    } catch (e: any) {
      setError(e.message || "Failed to prepare welcome email");
    }
    setLoading("");
  };

  const handleDigestEmail = async () => {
    if (!digestEmail.trim()) return;
    setLoading("digest");
    setError("");
    try {
      const result = await prepareBlogDigest({ data: { email: digestEmail } });
      setDigestResult(result);
    } catch (e: any) {
      setError(e.message || "Failed to prepare digest email");
    }
    setLoading("");
  };

  const handleWaitlistDigest = async () => {
    setLoading("waitlist");
    setError("");
    try {
      const result = await prepareBlogDigestForWaitlist();
      setWaitlistResult(result);
    } catch (e: any) {
      setError(e.message || "Failed to prepare waitlist digest");
    }
    setLoading("");
  };

  const tabs = [
    { key: "content" as const, label: "Content Pipeline" },
    { key: "blog" as const, label: "Blog Generator" },
    { key: "email" as const, label: "Email Controls" },
  ];

  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-6 py-10 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Content pipeline, blog generation, and email management.
          </p>
          <p className="text-xs text-gold/60 mt-2">
            Note: Requires OPENAI_API_KEY or ANTHROPIC_API_KEY to be set.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-navy text-navy"
                  : "border-transparent text-gray-500 hover:text-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* ── Tab: Content Pipeline ── */}
        {activeTab === "content" && (
          <>
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
          </>
        )}

        {/* ── Tab: Blog Generator ── */}
        {activeTab === "blog" && (
          <>
            <section className="bg-white border border-gray-200 p-6">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">
                Generate Blog Post
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Enter a topic or keyword and generate an AI-written blog post.
                Review the content and publish it directly to the AI Campus Journal.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={blogTopic}
                  onChange={(e) => setBlogTopic(e.target.value)}
                  placeholder="Enter a blog topic (e.g., 'AI Skills for Career Growth')"
                  className="flex-1 border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gold"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateBlog()}
                />
                <button
                  onClick={handleGenerateBlog}
                  disabled={loading === "blog" || !blogTopic.trim()}
                  className="px-6 py-2.5 rounded-sm bg-navy text-white text-sm font-medium hover:bg-navy-light disabled:opacity-50 transition-all whitespace-nowrap"
                >
                  {loading === "blog" ? "Generating..." : "Generate Blog Post"}
                </button>
              </div>

              {blogResult && (
                <div className="mt-6 bg-gray-50 p-4 rounded-sm text-sm">
                  {blogResult.mock && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-serif text-lg font-bold text-navy">
                          {blogResult.mock.title}
                        </h3>
                        <span className="text-xs text-gray-400">Draft</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-4">
                        Slug: {blogResult.mock.slug} · Author: {blogResult.mock.author}
                      </p>
                      <div className="bg-white p-4 border rounded-sm mb-4 max-h-96 overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap text-gray-700">
                          {blogResult.mock.content}
                        </pre>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handlePublishBlog}
                          disabled={loading === "publish"}
                          className="px-6 py-2.5 rounded-sm bg-crimson text-white text-sm font-medium hover:bg-crimson-dark disabled:opacity-50 transition-all"
                        >
                          {loading === "publish" ? "Publishing..." : "Publish Post"}
                        </button>
                        <button
                          onClick={() => { setBlogResult(null); setBlogTopic(""); }}
                          className="px-6 py-2.5 rounded-sm border border-gray-300 text-sm text-gray-600 hover:border-navy hover:text-navy transition-all"
                        >
                          Discard
                        </button>
                      </div>
                    </div>
                  )}
                  {blogResult.error && !blogResult.mock && (
                    <div className="text-amber-700">{blogResult.error}</div>
                  )}
                </div>
              )}

              {publishMsg && (
                <div className="mt-4 bg-green-50 border border-green-200 p-4 text-green-700 text-sm font-medium">
                  {publishMsg}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── Tab: Email Controls ── */}
        {activeTab === "email" && (
          <>
            {/* Welcome Email */}
            <section className="bg-white border border-gray-200 p-6">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">
                Send Welcome Email
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Prepare a welcome email for a new community member.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={welcomeName}
                    onChange={(e) => setWelcomeName(e.target.value)}
                    placeholder="Name (optional)"
                    className="w-1/3 border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gold"
                  />
                  <input
                    type="email"
                    value={welcomeEmail}
                    onChange={(e) => setWelcomeEmail(e.target.value)}
                    placeholder="Email address"
                    className="flex-1 border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gold"
                    onKeyDown={(e) => e.key === "Enter" && handleWelcomeEmail()}
                  />
                  <button
                    onClick={handleWelcomeEmail}
                    disabled={loading === "welcome" || !welcomeEmail.trim()}
                    className="px-6 py-2.5 rounded-sm bg-navy text-white text-sm font-medium hover:bg-navy-light disabled:opacity-50 transition-all whitespace-nowrap"
                  >
                    {loading === "welcome" ? "Preparing..." : "Prepare Welcome"}
                  </button>
                </div>
              </div>

              {welcomeResult && (
                <div className="mt-4 bg-green-50 border border-green-200 p-4 text-sm">
                  <p className="text-green-700 font-medium">{welcomeResult.message}</p>
                  <pre className="mt-3 text-xs bg-white p-3 border overflow-auto max-h-64">
                    {JSON.stringify(welcomeResult.email, null, 2)}
                  </pre>
                </div>
              )}
            </section>

            {/* Blog Digest — Individual */}
            <section className="bg-white border border-gray-200 p-6">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">
                Send Blog Digest (Individual)
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Send the latest 3 blog posts as a digest to a specific email address.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={digestEmail}
                  onChange={(e) => setDigestEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gold"
                  onKeyDown={(e) => e.key === "Enter" && handleDigestEmail()}
                />
                <button
                  onClick={handleDigestEmail}
                  disabled={loading === "digest" || !digestEmail.trim()}
                  className="px-6 py-2.5 rounded-sm bg-navy text-white text-sm font-medium hover:bg-navy-light disabled:opacity-50 transition-all whitespace-nowrap"
                >
                  {loading === "digest" ? "Preparing..." : "Prepare Digest"}
                </button>
              </div>

              {digestResult && (
                <div className="mt-4 bg-green-50 border border-green-200 p-4 text-sm">
                  <p className="text-green-700 font-medium">
                    {digestResult.message} ({digestResult.postCount} posts)
                  </p>
                  <pre className="mt-3 text-xs bg-white p-3 border overflow-auto max-h-64">
                    {JSON.stringify(digestResult.email, null, 2)}
                  </pre>
                </div>
              )}
            </section>

            {/* Blog Digest — All Waitlisters */}
            <section className="bg-white border border-gray-200 p-6">
              <h2 className="font-serif text-xl font-bold text-navy mb-4">
                Send Blog Digest (All Waitlisters)
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Prepare the blog digest for everyone on the waitlist.
              </p>
              <button
                onClick={handleWaitlistDigest}
                disabled={loading === "waitlist"}
                className="px-6 py-2.5 rounded-sm bg-crimson text-white text-sm font-medium hover:bg-crimson-dark disabled:opacity-50 transition-all"
              >
                {loading === "waitlist" ? "Preparing..." : "Prepare Digest for Waitlisters"}
              </button>

              {waitlistResult && (
                <div className="mt-4 bg-green-50 border border-green-200 p-4 text-sm">
                  <p className="text-green-700 font-medium">
                    {waitlistResult.message} ({waitlistResult.postCount} posts)
                  </p>
                  {waitlistResult.recipientCount > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-navy mb-2">
                        Recipients ({waitlistResult.recipientCount}):
                      </p>
                      <pre className="text-xs bg-white p-3 border overflow-auto max-h-40">
                        {waitlistResult.recipients.join("\n")}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </section>
          </>
        )}

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
