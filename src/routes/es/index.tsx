import { createFileRoute } from "@tanstack/react-router";
import { LocaleProvider } from "~/lib/LocaleContext";
import { LandingPage } from "~/components/LandingPage";

export const Route = createFileRoute("/es/")({
  component: EsHome,
});

function EsHome() {
  return (
    <LocaleProvider locale="es">
      <LandingPage locale="es" />
    </LocaleProvider>
  );
}
