import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../../utils/seo";
import { ProjectsIndexComponent } from "@/components/projects-index-component";

export const Route = createFileRoute("/projects/")({
  component: ProjectsIndexComponent,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Rescope | All Projects",
        description: `Rescope simplifies the permitting process and reduces time to permit by 70%.`,
      }),
    ],
  }),
});
