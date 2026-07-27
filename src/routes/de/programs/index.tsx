import { createFileRoute } from "@tanstack/react-router";
import { getBundles } from "~/lib/server";
import { LocaleProvider } from "~/lib/LocaleContext";
import { ProgramsPageContent } from "~/components/ProgramsPage";

export const Route = createFileRoute("/de/programs/")({
  component: DeProgramsRoute,
  loader: async () => {
    const bundles = await getBundles({ data: "de" });
    return { bundles };
  },
});

function DeProgramsRoute() {
  const { bundles } = Route.useLoaderData();
  return (
    <LocaleProvider locale="de">
      <ProgramsPageContent locale="de" bundles={bundles} />
    </LocaleProvider>
  );
}
