import { createFileRoute, Link } from "@tanstack/react-router";
import { getBundles } from "~/lib/server";

export const Route = createFileRoute("/programs/")({
  component: ProgramsListingPage,
  loader: async () => {
    const bundles = await getBundles();
    return { bundles };
  },
});

function ProgramsListingPage() {
  const { bundles } = Route.useLoaderData();

  return (
    <div className="min-h-dvh bg-cream">
      {/* Hero */}
      <div className="bg-navy px-6 py-20 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-gold mb-4">
            AI Campus
          </p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-4">
            Our Programs
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Rigorous, AI-powered programs designed to give you practical,
            real-world skills. Earn verifiable certificates from a prestigious
            online institution.
          </p>
        </div>
      </div>

      {/* Program cards */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {bundles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No programs available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bundles.map((bundle: any) => (
              <Link
                key={bundle.id}
                to="/programs/$slug"
                params={{ slug: bundle.slug }}
                className="group bg-white border border-gray-200 hover:border-gold/40 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <p className="text-xs font-medium uppercase tracking-widest text-gold mb-2">
                    {bundle.school}
                  </p>
                  <h2 className="font-serif text-xl font-bold text-navy mb-3 group-hover:text-navy-light transition-colors">
                    {bundle.title}
                  </h2>
                  {bundle.subtitle && (
                    <p className="text-sm text-gray-500 font-serif italic mb-4">
                      {bundle.subtitle}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-3 mb-6">
                    {bundle.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-3 text-xs text-gray-400">
                      <span>{bundle.modulesCount} modules</span>
                      <span>·</span>
                      <span>~{bundle.hours}h</span>
                    </div>
                    <div className="text-right">
                      {bundle.launchPriceCents ? (
                        <div>
                          <span className="font-bold text-navy">
                            ${(bundle.launchPriceCents / 100).toFixed(0)} USD
                          </span>
                          <span className="ml-1 text-xs text-gray-400 line-through">
                            ${(bundle.priceCents / 100).toFixed(0)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-navy">
                          ${(bundle.priceCents / 100).toFixed(0)} USD
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
