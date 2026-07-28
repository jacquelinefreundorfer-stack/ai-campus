import { createFileRoute } from "@tanstack/react-router";
import { getBundleBySlug } from "~/lib/server";
import { LocaleProvider } from "~/lib/LocaleContext";
import { ProgramDetailPageContent } from "~/components/ProgramDetailPage";

export const Route = createFileRoute("/de/programs/$slug/")({
  component: DeProgramDetailRoute,
  loader: async ({ params }) => {
    const bundle = await getBundleBySlug({ data: params.slug });
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
