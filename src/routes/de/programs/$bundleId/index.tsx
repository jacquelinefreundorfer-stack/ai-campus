import { createFileRoute } from "@tanstack/react-router";
import { getBundle } from "~/lib/server";
import { LocaleProvider } from "~/lib/LocaleContext";
import { ProgramDetailPageContent } from "~/components/ProgramDetailPage";

export const Route = createFileRoute("/de/programs/$bundleId/")({
  component: DeProgramDetailRoute,
  loader: async ({ params }) => {
    const bundleId = parseInt(params.bundleId);
    const bundle = await getBundle({ data: bundleId });
    return { bundle };
  },
});

function DeProgramDetailRoute() {
  const { bundle } = Route.useLoaderData();
  return (
    <LocaleProvider locale="de">
      <ProgramDetailPageContent locale="de" bundle={bundle} />
    </LocaleProvider>
  );
}
