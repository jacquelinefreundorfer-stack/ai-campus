import { createFileRoute, redirect } from "@tanstack/react-router";
import { getBundle } from "~/lib/server";

export const Route = createFileRoute("/es/programs/$bundleId/")({
  loader: async ({ params }) => {
    const bundleId = parseInt(params.bundleId);
    if (isNaN(bundleId)) {
      throw redirect({ to: "/es/programs" });
    }
    const bundle = await getBundle({ data: bundleId });
    if (!bundle || !bundle.slug) {
      throw redirect({ to: "/es/programs" });
    }
    throw redirect({ to: "/es/programs/$slug", params: { slug: bundle.slug } });
  },
  component: () => null,
});
