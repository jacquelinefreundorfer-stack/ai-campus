import { createFileRoute, Link } from "@tanstack/react-router";
import { getBlogPost } from "~/lib/server";
import type { ReactNode } from "react";

// ── Markdown Renderer (same as lesson player) ────────────────────────────

function renderInline(text: string): ReactNode {
  let t = text;
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*(.+?)\*/g, "<em>$1</em>");
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-crimson hover:underline">$1</a>');
  const parts = t.split(/(<strong>.*?<\/strong>|<em>.*?<\/em>|<code>.*?<\/code>|<a .*?<\/a>)/g);
  return parts.map((part, i) => {
    if (part.startsWith("<strong>")) return <strong key={i}>{part.replace(/<\/?strong>/g, "")}</strong>;
    if (part.startsWith("<em>")) return <em key={i}>{part.replace(/<\/?em>/g, "")}</em>;
    if (part.startsWith("<code>")) return <code key={i} className="bg-gray-100 px-1 py-0.5 rounded text-sm text-crimson">{part.replace(/<\/?code>/g, "")}</code>;
    if (part.startsWith("<a ")) return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(content: string | null): ReactNode {
  if (!content) return <p className="text-gray-500 italic">No content available.</p>;
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let i = 0, key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("# ")) { elements.push(<h1 key={key++} className="font-serif text-3xl font-bold text-navy mt-8 mb-4">{line.slice(2)}</h1>); i++; }
    else if (line.startsWith("## ")) { elements.push(<h2 key={key++} className="font-serif text-2xl font-bold text-navy mt-8 mb-3">{line.slice(3)}</h2>); i++; }
    else if (line.startsWith("### ")) { elements.push(<h3 key={key++} className="font-serif text-xl font-semibold text-navy mt-6 mb-2">{line.slice(4)}</h3>); i++; }
    else if (line.startsWith("#### ")) { elements.push(<h4 key={key++} className="font-serif text-lg font-semibold text-navy mt-4 mb-2">{line.slice(5)}</h4>); i++; }
    else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) { items.push(lines[i].slice(2)); i++; }
      elements.push(<ul key={key++} className="list-disc pl-6 space-y-1 text-gray-700 mb-4">{items.map((item, idx) => <li key={idx}>{renderInline(item)}</li>)}</ul>);
    }
    else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, "")); i++; }
      elements.push(<ol key={key++} className="list-decimal pl-6 space-y-1 text-gray-700 mb-4">{items.map((item, idx) => <li key={idx}>{renderInline(item)}</li>)}</ol>);
    }
    else if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) { tableLines.push(lines[i]); i++; }
      if (tableLines.length >= 2) {
        const parseRow = (l: string) => l.split("|").filter(c => c.trim() !== "").map(c => c.trim());
        const header = parseRow(tableLines[0]);
        const rows = tableLines.slice(2).map(parseRow).filter(r => r.length > 0);
        elements.push(<div key={key++} className="overflow-x-auto mb-4"><table className="min-w-full border border-gray-200 text-sm"><thead className="bg-navy text-white"><tr>{header.map((h, hi) => <th key={hi} className="px-4 py-2 text-left font-medium">{h}</th>)}</tr></thead><tbody>{rows.map((row, ri) => <tr key={ri} className="border-t border-gray-200 even:bg-gray-50">{row.map((cell, ci) => <td key={ci} className="px-4 py-2 text-gray-700">{renderInline(cell)}</td>)}</tr>)}</tbody></table></div>);
      }
    }
    else if (line.startsWith("> ")) { elements.push(<blockquote key={key++} className="border-l-4 border-gold/50 pl-4 italic text-gray-600 my-4">{line.slice(2)}</blockquote>); i++; }
    else if (line.trim() === "") { i++; }
    else {
      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("- ") && !lines[i].startsWith("|") && !lines[i].startsWith("> ") && !/^\d+\.\s/.test(lines[i])) { paraLines.push(lines[i]); i++; }
      if (paraLines.length > 0) {
        elements.push(<p key={key++} className="text-gray-700 leading-relaxed mb-4">{paraLines.map((pl, pi) => <span key={pi}>{pi > 0 && <br />}{renderInline(pl)}</span>)}</p>);
      }
    }
  }
  return <div className="prose max-w-none">{elements}</div>;
}

// ── Program CTA mapping ──────────────────────────────────────────────────

const programCTA: Record<string, { name: string; url: string }> = {
  "ai-career": { name: "AI & Generative AI Practitioner", url: "/programs" },
  "ai-marketing": { name: "Digital Marketing & Growth Strategy", url: "/programs" },
  "data-literacy": { name: "Data Science & Business Analytics", url: "/programs" },
};

// ── Route ────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/blog/$slug/")({
  component: BlogPostPage,
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: params.slug });
    return { post, slug: params.slug };
  },
});

function BlogPostPage() {
  const { post, slug } = Route.useLoaderData();
  const cta = programCTA[slug] || { name: "AI & Generative AI Practitioner", url: "/programs" };

  if (!post) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center">
        <div className="text-center px-6">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-gold/40 bg-navy mx-auto mb-6">
            <span className="font-serif text-xl font-bold text-white">AI</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-navy mb-4">
            Article not found
          </h1>
          <p className="text-gray-500 mb-8">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light transition-all"
          >
            ← Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      {/* Article header */}
      <div className="bg-navy px-6 py-16 text-white">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="text-xs text-gold/80 hover:text-gold inline-flex items-center gap-1 mb-6 transition-colors"
          >
            ← Back to Journal
          </Link>
          <p className="text-xs font-medium uppercase tracking-widest text-gold mb-4">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {post.author || "AI Campus"}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-6 text-lg text-gray-300 leading-relaxed font-serif italic">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <article className="bg-white border border-gray-200 p-8 md:p-12">
          {renderMarkdown(post.content)}
        </article>

        {/* CTA */}
        <div className="mt-12 bg-navy text-white p-8 md:p-10 text-center">
          <div className="flex justify-center mb-5">
            <div className="h-px w-16 bg-gold/50" />
          </div>
          <h3 className="font-serif text-xl font-bold mb-3">
            Master these skills
          </h3>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Enroll in a program at AI Campus and earn a verifiable certificate
            that demonstrates real competencies to employers.
          </p>
          <a
            href={cta.url}
            className="inline-flex items-center gap-2 rounded-sm bg-crimson px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-crimson-dark"
          >
            Enroll in {cta.name} →
          </a>
          <div className="flex justify-center mt-5">
            <div className="h-px w-16 bg-gold/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
