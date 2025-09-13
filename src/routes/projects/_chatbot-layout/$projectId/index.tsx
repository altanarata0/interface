import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/_chatbot-layout/$projectId/")({
  loader: ({ params }) => {
    throw redirect({
      to: "/projects/$projectId/intake-form",
      params,
    });
  },
  component: RouteComponent, // This component will not be rendered due to the redirect
});

function RouteComponent() {
  // This component is effectively unused due to the redirect,
  // but TanStack Router requires a component to be defined.
  return null;
}
