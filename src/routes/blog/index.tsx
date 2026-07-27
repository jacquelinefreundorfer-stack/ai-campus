import { createFileRoute, Link } from "@tanstack/react-router";
import { getBlogPosts } from "~/lib/server";

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
  loader: async () => {
    const data = await getBlogPosts({ data: { page: 1, limit: 10 } });
    return { data };
  },
});

function BlogIndexPage() {
  const { data } = Route.useLoaderData();
  const { posts, total } = data;

  return (
    <div className="min-h-dvh bg-cream">
      {/* Hero */}
      <div className="bg-navy px-6 py-20 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-gold mb-4">
            The Journal
          </p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-4">
            AI Campus Journal
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Practical insights on AI, data science, digital marketing, and
            professional development — from the faculty of AI Campus.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-serif">
              No articles published yet. Check back soon for insights from our faculty.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-10 text-center font-serif">
              {total} article{total !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <Link
                  key={post.id}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group bg-white border border-gray-200 hover:border-gold/40 hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs font-medium uppercase tracking-widest text-gold mb-3">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h2 className="font-serif text-xl font-bold text-navy mb-3 group-hover:text-navy-light transition-colors leading-snug">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {post.author || "AI Campus"}
                      </span>
                      <span className="text-xs font-medium text-gold group-hover:text-navy transition-colors">
                        Read more →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
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
