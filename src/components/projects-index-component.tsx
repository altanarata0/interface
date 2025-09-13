import { AllProjectsTracker } from "@/components/screens/projects-tracker/index";
import { useAppStore } from "@/providers/app-store-provider";
import { useCallback } from "react";
import { project } from "@/lib/dummy-data/projects/0GDKHg3LN";

const customerNames = [
  "Bechtel Corporation",
  "Gilbane Building Company",
  "Skanska USA",
  "The Whiting-Turner Contracting Company",
  "Turner Construction Company",
  "Kiewit Corporation",
  "James Hunt",
  "David Miller",
  "Micheal Anderson",
  "William Brooks",
];

const getRandomCustomerName = () => {
  return customerNames[Math.floor(Math.random() * customerNames.length)];
};

export function ProjectsIndexComponent() {
  const {
    projects,
    addProject,
    addProjectToIntakeFormParseList,
    addProjectToBlueprintsParseList,
  } = useAppStore((state) => state);

  const addNewProject = useCallback(() => {
    addProject({ ...project, customerName: getRandomCustomerName() });
    addProjectToIntakeFormParseList(project.id);
    addProjectToBlueprintsParseList(project.id);

    return project.id;
  }, [
    addProject,
    addProjectToIntakeFormParseList,
    addProjectToBlueprintsParseList,
  ]);

  return (
    // TODO: might want to move the css to a parent
    //TODO: urgent use signature authentication for uppy
    <div className="h-full w-full p-3">
      <AllProjectsTracker
        projects={projects}
        addProject={addNewProject}
        config={{
          mapboxAccessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
          transloaditApiKey: import.meta.env.VITE_TRANSLOADIT_AUTH_KEY,
          transloaditTemplateId: import.meta.env.VITE_TRANSLOADIT_TEMPLATE_ID,
        }}
      />
    </div>
  );
}
