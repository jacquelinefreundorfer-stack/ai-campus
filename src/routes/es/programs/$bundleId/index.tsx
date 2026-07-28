import { createFileRoute, redirect } from "@tanstack/react-router";
import { getBundle } from "~/lib/server";

export const Route = createFileRoute("/es/programs/$bundleId")({
  loader: async ({ params }) => {
    const id = parseInt(params.bundleId);
    const bundle = await getBundle({ data: id });
    if (!bundle) throw new Error("Bundle not found");
    throw redirect({ to: "/es/programs/$slug", params: { slug: bundle.slug } });
  },
});
