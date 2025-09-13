import { useAppStore } from "@/providers/app-store-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Compliance } from "./left-panel/compliance";
import { FileSystemNav } from "./left-panel/file-system-nav";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { PlanCheckViewOutline } from "./left-panel/plan-check-view-outline";
import { useState } from "react";
import { PlanCheckEditOutline } from "./left-panel/plan-check-edit-outline";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UploadBlueprintsDialogContent } from "./upload-blueprints-dialog-content";
import { Editor } from "@tiptap/core";
import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

export const LeftPanel = ({
  editor,
  items,
  pageNavigationPlugin,
  transloaditApiKey,
  transloaditTemplateId,
}: {
  editor: Editor | null;
  items: TableOfContentDataItem[];
  pageNavigationPlugin: PageNavigationPlugin;
  transloaditApiKey: string;
  transloaditTemplateId: string;
}) => {
  const {
    tab,
    setTab,
    pclMode,
    selectedProjectId,
    addProjectToBlueprintsParseList,
    addProjectToNewRegulationsList,
  } = useAppStore((state) => state);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="h-full w-full bg-white rounded-lg shadow overflow-hidden border border-gray-300 p-2 flex flex-col">
      <Tabs
        className="h-full flex flex-col grow"
        value={tab}
        onValueChange={(value) =>
          setTab(value as "code-review" | "files" | "pcl")
        }
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 flex-grow w-full mr-2">
            <TabsList className="inline-flex h-9 rounded-sm bg-muted p-1 w-full">
              <TabsTrigger
                value="code-review"
                className="flex-1 rounded-[3px] text-sm data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Code Review
              </TabsTrigger>
              <TabsTrigger
                value="pcl"
                className="flex-1 rounded-[3px] text-sm data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Plan Check Letter
              </TabsTrigger>
            </TabsList>
          </div>
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="h-9 ml-2">
                + Upload blueprints
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[50vw] sm:max-w-[750px] h-fit">
              <UploadBlueprintsDialogContent
                transloaditApiKey={transloaditApiKey}
                transloaditTemplateId={transloaditTemplateId}
                onDone={(filesUploaded) => {
                  setIsUploadModalOpen(false);

                  if (filesUploaded && selectedProjectId) {
                    addProjectToBlueprintsParseList(selectedProjectId);
                    addProjectToNewRegulationsList(selectedProjectId);
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="h-px bg-gray-200 -mx-2"></div>
        <TabsContent value="code-review" className="grow overflow-hidden">
          <div
            className="h-full overflow-auto"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              overflowY: "scroll",
            }}
          >
            <Compliance />
          </div>
        </TabsContent>
        <TabsContent value="files" className="grow overflow-hidden">
          <div className="h-full overflow-auto custom-scrollbar">
            <FileSystemNav />
          </div>
        </TabsContent>
        <TabsContent value="pcl" className="grow overflow-hidden">
          <div className="h-full overflow-auto custom-scrollbar">
            {pclMode === "view" ? (
              <PlanCheckViewOutline
                pageNavigationPlugin={pageNavigationPlugin}
              />
            ) : (
              <PlanCheckEditOutline editor={editor} items={items} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
