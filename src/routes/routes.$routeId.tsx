import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/routes/$routeId")({
  component: () => null,
});
