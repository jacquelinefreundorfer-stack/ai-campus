import { createFileRoute, redirect } from "@tanstack/react-router";
import { getBundle } from "~/lib/server";

export const Route = createFileRoute("/programs/$bundleId/")({
  loader: async ({ params }) => {
    const bundleId = parseInt(params.bundleId);
    if (isNaN(bundleId)) {
      throw redirect({ to: "/programs" });
    }
    const bundle = await getBundle({ data: bundleId });
    if (!bundle || !bundle.slug) {
      throw redirect({ to: "/programs" });
    }
    throw redirect({ to: "/programs/$slug", params: { slug: bundle.slug } });
  },
  component: () => null,
});
