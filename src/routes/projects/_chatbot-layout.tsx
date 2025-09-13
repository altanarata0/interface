import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ChatbotSection } from "@/components/chatbot/chatbot-section";

export const Route = createFileRoute("/projects/_chatbot-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex gap-0 pl-3 h-full">
      <div className="w-3/4 h-full">
        <Outlet />
      </div>
      <div className="pr-3 py-3 w-1/3 h-full">
        <ChatbotSection className="h-full" />
      </div>
    </div>
  );
}
