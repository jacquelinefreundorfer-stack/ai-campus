import { createFileRoute } from "@tanstack/react-router";
import { LocaleProvider } from "~/lib/LocaleContext";
import { LandingPage } from "~/components/LandingPage";

export const Route = createFileRoute("/de/")({
  component: DeHome,
});

function DeHome() {
  return (
    <LocaleProvider locale="de">
      <LandingPage locale="de" />
    </LocaleProvider>
  );
}
