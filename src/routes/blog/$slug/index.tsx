import { createFileRoute, Link } from "@tanstack/react-router";
import { getBlogPost } from "~/lib/server";

// ── Simple Markdown → HTML renderer ───────────────────────────────────────

function processInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function renderMarkdown(content: string): string {
  const lines = content.split("\n");
  let result = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      result += '<h3 class="font-serif text-xl font-bold text-navy mt-8 mb-3">' + processInline(line.slice(4)) + '</h3>';
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      result += '<h2 class="font-serif text-2xl font-bold text-navy mt-10 mb-4">' + processInline(line.slice(3)) + '</h2>';
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      result += '<h1 class="font-serif text-3xl font-bold text-navy mt-10 mb-4">' + processInline(line.slice(2)) + '</h1>';
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      result += '<blockquote class="border-l-4 border-gold pl-4 italic text-gray-600 my-4">' + processInline(line.slice(2)) + '</blockquote>';
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      result += '<ul class="list-disc pl-6 my-4 space-y-1 text-gray-700 leading-relaxed">';
      while (i < lines.length && lines[i].startsWith("- ")) {
        result += '<li>' + processInline(lines[i].slice(2)) + '</li>';
        i++;
      }
      result += '</ul>';
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      result += '<ol class="list-decimal pl-6 my-4 space-y-1 text-gray-700 leading-relaxed">';
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        result += '<li>' + processInline(lines[i].replace(/^\d+\.\s/, "")) + '</li>';
        i++;
      }
      result += '</ol>';
      continue;
    }

    let paragraph = "";
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("- ") &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      paragraph += (paragraph ? " " : "") + lines[i].trim();
      i++;
    }
    if (paragraph) {
      result += '<p class="text-gray-700 leading-relaxed mb-4">' + processInline(paragraph) + '</p>';
    }
  }

  return result;
}

// ── Route ──────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/blog/$slug/")({
  component: BlogPostPage,
  loader: async ({ params }) => {
    const { slug } = params;
    const post = await getBlogPost({ data: slug });
    return { post };
  },
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  if (!post) {
    return (
      <div className="min-h-dvh bg-cream">
        <div className="bg-navy px-6 py-20 text-white">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-gold mb-4">
              The Journal
            </p>
            <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-4">
              Post Not Found
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              The article you are looking for does not exist or is no longer available.
            </p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white transition-all hover:bg-navy-light"
          >
            ← Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  const bodyHtml = renderMarkdown(post.content);

  return (
    <div className="min-h-dvh bg-cream">
      {/* Hero header */}
      <div className="bg-navy px-6 py-16 text-white">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors mb-6"
          >
            ← Back to Journal
          </Link>
          <p className="text-xs font-medium uppercase tracking-widest text-gold mb-4">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-gray-400 text-sm">
            By {post.author || "AI Campus"}
          </p>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <article
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>

      {/* Footer CTA */}
      <div className="bg-navy px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold font-serif text-lg mb-4">
            Ready to put these insights into practice?
          </p>
          <h2 className="font-serif text-2xl font-bold text-white mb-4">
            Master the skills that define modern careers
          </h2>
          <a
            href="/programs"
            className="inline-flex items-center gap-2 rounded-sm bg-crimson px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-crimson-dark"
          >
            Explore Programs
          </a>
        </div>
      </div>
    </div>
  );
}
