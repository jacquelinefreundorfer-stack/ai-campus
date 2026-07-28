import { createFileRoute } from "@tanstack/react-router";
import { getBundleBySlug } from "~/lib/server";
import { LocaleProvider } from "~/lib/LocaleContext";
import { ProgramDetailPageContent } from "~/components/ProgramDetailPage";

export const Route = createFileRoute("/es/programs/$slug/")({
  component: EsProgramDetailRoute,
  loader: async ({ params }) => {
    const bundle = await getBundleBySlug({ data: params.slug });
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
