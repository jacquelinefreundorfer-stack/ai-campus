import { createFileRoute } from "@tanstack/react-router";
import { getBundle } from "~/lib/server";
import { LocaleProvider } from "~/lib/LocaleContext";
import { ProgramDetailPageContent } from "~/components/ProgramDetailPage";

export const Route = createFileRoute("/es/programs/$bundleId/")({
  component: EsProgramDetailRoute,
  loader: async ({ params }) => {
    const bundleId = parseInt(params.bundleId);
    const bundle = await getBundle({ data: bundleId });
    return { bundle };
  },
});

function EsProgramDetailRoute() {
  const { bundle } = Route.useLoaderData();
  return (
    <LocaleProvider locale="es">
      <ProgramDetailPageContent locale="es" bundle={bundle} />
    </LocaleProvider>
  );
}
