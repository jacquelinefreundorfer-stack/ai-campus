import { createFileRoute } from "@tanstack/react-router";
import { getBundles } from "~/lib/server";
import { LocaleProvider } from "~/lib/LocaleContext";
import { ProgramsPageContent } from "~/components/ProgramsPage";

export const Route = createFileRoute("/es/programs/")({
  component: EsProgramsRoute,
  loader: async () => {
    const bundles = await getBundles({ data: "es" });
    return { bundles };
  },
});

function EsProgramsRoute() {
  const { bundles } = Route.useLoaderData();
  return (
    <LocaleProvider locale="es">
      <ProgramsPageContent locale="es" bundles={bundles} />
    </LocaleProvider>
  );
}
