import { createFileRoute, Link } from "@tanstack/react-router";
import { getBundles } from "~/lib/server";

export const Route = createFileRoute("/programs/")({
  component: ProgramsPage,
  loader: async () => {
    const bundles = await getBundles();
    return { bundles };
  },
});

function ProgramsPage() {
  const { bundles } = Route.useLoaderData();

  if (bundles.length === 0) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-navy mb-4">Programs</h1>
          <p className="text-gray-600">No programs available yet. Check back soon.</p>
          <Link to="/" className="mt-6 inline-block text-gold hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      <div className="bg-navy px-6 py-16 text-center text-white">
        <Link to="/" className="text-gold/60 hover:text-gold text-sm mb-6 inline-block">← Back to AI Campus</Link>
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">Programs of Study</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">Curated programs designed for immediate professional application.</p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {bundles.map((bundle: any) => (
          <div key={bundle.id} className="bg-white border border-gray-200 shadow-sm p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-widest text-gold mb-2">{bundle.school}</p>
                <h2 className="font-serif text-2xl font-bold text-navy mb-3">{bundle.title}</h2>
                {bundle.subtitle && <p className="text-gray-500 mb-3 font-serif italic">{bundle.subtitle}</p>}
                <p className="text-gray-600 leading-relaxed mb-4">{bundle.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500"><span>{bundle.modulesCount} modules</span><span>·</span><span>~{bundle.hours} hours</span></div>
              </div>
              <div className="flex flex-col items-start gap-3 min-w-[200px]">
                {bundle.launchPriceCents ? (
                  <div><span className="font-serif text-2xl font-bold text-navy">${(bundle.launchPriceCents / 100).toFixed(0)} USD</span><span className="ml-2 text-base text-gray-400 line-through">${(bundle.priceCents / 100).toFixed(0)} USD</span></div>
                ) : <span className="font-serif text-2xl font-bold text-navy">${(bundle.priceCents / 100).toFixed(0)} USD</span>}
                <Link to="/programs/$bundleId" params={{ bundleId: String(bundle.id) }} className="w-full inline-flex justify-center rounded-sm bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-all">View Program</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center pb-16">
        <Link to="/" className="text-gold hover:underline font-serif text-sm">← Return to AI Campus Home</Link>
      </div>
    </div>
  );
}
