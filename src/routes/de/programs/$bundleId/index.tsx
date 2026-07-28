import { createFileRoute, redirect } from "@tanstack/react-router";
import { getBundle } from "~/lib/server";

export const Route = createFileRoute("/de/programs/$bundleId")({
  loader: async ({ params }) => {
    const id = parseInt(params.bundleId);
    const bundle = await getBundle({ data: id });
    if (!bundle) throw new Error("Bundle not found");
    throw redirect({ to: "/de/programs/$slug", params: { slug: bundle.slug } });
  },
});
