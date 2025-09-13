import React, { useState, useEffect } from "react";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { LeftPanel } from "./left-panel";
import { useCustomEditor } from "@/hooks/use-custom-editor";
import { MiddlePanel } from "./middle-panel";
import { RightPanel } from "./right-panel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/providers/app-store-provider";
import { REGULATIONS } from "@/lib/dummy-data/projects/regulations-new";
import { LoaderCircleIcon } from "lucide-react";

interface ProjectLayoutProps {
  transloaditApiKey: string;
  transloaditTemplateId: string;
  // project: Project;
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  transloaditApiKey,
  transloaditTemplateId,
}) => {
  const { editor, items } = useCustomEditor();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const {
    selectedProjectId,
    getProjectById,
    setRegulationsForSelectedFile,
    parseBlueprints,
    removeProjectFromBlueprintsParseList,
    newRegulations,
    removeProjectFromNewRegulationsList,
  } = useAppStore((state) => state);

  const [isParsingModalOpen, setIsParsingModalOpen] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  useEffect(() => {
    if (selectedProjectId && parseBlueprints.includes(selectedProjectId)) {
      setIsParsingModalOpen(true);
      setParsingProgress(0);
      console.log("parsing blueprints");

      const progressInterval = setInterval(() => {
        setParsingProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          if (prevProgress === 0) return 8;
          if (prevProgress === 8) return 16;
          if (prevProgress === 16) return 21;
          if (prevProgress === 21) return 27;
          if (prevProgress === 27) return 36;
          if (prevProgress === 39) return 47;
          if (prevProgress === 47) return 63;
          if (prevProgress === 63) return 72;
          if (prevProgress === 72) return 77;
          if (prevProgress === 77) return 86;
          if (prevProgress === 86) return 93;
          if (prevProgress === 98) return 98;
          if (prevProgress === 98) return 100;

          return 100;
        });
      }, 2000);

      const modalCloseTimeout = setTimeout(() => {
        setIsParsingModalOpen(false);
        removeProjectFromBlueprintsParseList(selectedProjectId);
      }, 6000);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(modalCloseTimeout);
      };
    }
  }, [
    parseBlueprints,
    selectedProjectId,
    removeProjectFromBlueprintsParseList,
  ]);

  useEffect(() => {
    if (parsingProgress === 56) {
      selectedProjectId &&
        newRegulations.includes(selectedProjectId) &&
        setRegulationsForSelectedFile(REGULATIONS);

      selectedProjectId &&
        removeProjectFromNewRegulationsList(selectedProjectId);
    }
  }, [parsingProgress, selectedProjectId]);

  if (!selectedProjectId) return null;

  const project = getProjectById(selectedProjectId);

  if (!project) return null;

  return (
    <>
      {isParsingModalOpen && (
        <Dialog open={isParsingModalOpen} onOpenChange={setIsParsingModalOpen}>
          <DialogContent
            className="max-w-[450px] h-fit"
            hideCloseButton
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-center">Processing</DialogTitle>
            </DialogHeader>
            <div className="py-6 px-6 space-y-4">
              {/* <img
                src="/processing.gif"
                alt="Processing"
                className="w-full h-48"
              /> */}
              <div className="relative mx-auto h-32 w-32">
                <LoaderCircleIcon className="animate-spin stroke-1 w-full h-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-medium">{parsingProgress}%</p>
                </div>
              </div>
              <p className="mt-6 text-center text-lg font-medium">
                Parsing blueprints...
              </p>
              <Progress value={parsingProgress} className="w-full" />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="bg-muted p-3 grid grid-cols-[32fr_45fr_23fr] gap-x-3 h-full w-full">
        <LeftPanel
          editor={editor}
          items={items}
          pageNavigationPlugin={pageNavigationPluginInstance}
          transloaditApiKey={transloaditApiKey}
          transloaditTemplateId={transloaditTemplateId}
        />
        <MiddlePanel
          editor={editor}
          pageNavigationPlugin={pageNavigationPluginInstance}
        />
        <RightPanel project={project} />
      </div>
    </>
  );
};
