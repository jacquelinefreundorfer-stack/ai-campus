import { createFileRoute, Link } from "@tanstack/react-router";
import { getBlogPost } from "~/lib/server";
import { jsonLdArticle, buildOgTags } from "~/lib/seo";

const SITE_URL = "https://aicampus.ctonew.app";

// ── Simple markdown → HTML (inline, no external dep) ─────────────────────────

function renderMarkdown(content: string): string {
  if (!content) return "";
  const lines = content.split("\n");
  let result = "";
  let i = 0;

  const processInline = (text: string): string => {
    // Bold **text**
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    // Italic *text*
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code `code`
    text = text.replace(/`(.+?)`/g, '<code class="bg-gray-100 text-navy px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    // Links [text](url)
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-navy underline hover:text-navy-light">$1</a>');
    return text;
  };

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    if (line.startsWith("### ")) {
      const heading = line.slice(4);
      result += '<h3 class="font-serif text-xl font-bold text-navy mt-8 mb-3">' + processInline(heading) + '</h3>';
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      const heading = line.slice(3);
      result += '<h2 class="font-serif text-2xl font-bold text-navy mt-10 mb-4">' + processInline(heading) + '</h2>';
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      const heading = line.slice(2);
      result += '<h1 class="font-serif text-3xl font-bold text-navy mt-10 mb-4">' + processInline(heading) + '</h1>';
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      let quoteLines = "";
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines += lines[i].slice(2) + "\n";
        i++;
      }
      result += '<blockquote class="border-l-4 border-gold bg-gold-pale px-4 py-2 my-4 text-gray-700 italic"><p>' + processInline(quoteLines.trim()) + '</p></blockquote>';
      continue;
    }

    // Unordered list
    if (line.match(/^[\-\*]\s/)) {
      let listItems = "";
      while (i < lines.length && lines[i].match(/^[\-\*]\s/)) {
        const item = lines[i].replace(/^[\-\*]\s/, "");
        listItems += '<li class="text-gray-700 mb-1 ml-4 list-disc">' + processInline(item) + '</li>';
        i++;
      }
      result += '<ul class="my-3">' + listItems + '</ul>';
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      let listItems = "";
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        const item = lines[i].replace(/^\d+\.\s/, "");
        listItems += '<li class="text-gray-700 mb-1 ml-4 list-decimal">' + processInline(item) + '</li>';
        i++;
      }
      result += '<ol class="my-3">' + listItems + '</ol>';
      continue;
    }

    // Horizontal rule
    if (line.match(/^\-{3,}$/)) {
      result += '<hr class="my-8 border-gray-200"/>';
      i++;
      continue;
    }

    // Empty line = paragraph break
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Gather paragraph lines until blank or special
    let paragraph = line;
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("> ") &&
      !lines[i].match(/^[\-\*]\s/) &&
      !lines[i].match(/^\d+\.\s/) &&
      !lines[i].match(/^\-{3,}$/)
    ) {
      paragraph += " " + lines[i];
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
  head: ({ loaderData }) => {
    const post = (loaderData as any)?.post;
    if (!post) return { meta: [{ title: "Post Not Found — AI Campus" }] };

    const ogTags = buildOgTags({
      title: post.title + " — AI Campus Journal",
      description: post.excerpt || "Read " + post.title + " on the AI Campus Journal.",
      url: SITE_URL + "/blog/" + post.slug,
      type: "article",
      publishedAt: post.publishedAt,
      author: post.author,
    });

    return {
      meta: [
        { title: post.title + " — AI Campus Journal" },
        { name: "description", content: post.excerpt || "" },
        ...ogTags,
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLdArticle(post)),
        },
      ],
    };
  },
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
