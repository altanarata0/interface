import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { PDFViewer } from "./pdf-viewer-component";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { ProjectFile } from "@/components/screens/projects-tracker/types";

export const FileViewer = ({ file }: { file: ProjectFile }) => {
  if (!file) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-gray-500">Select a file to view</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header with file name */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium truncate">{file.name}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(file.url, "_blank")}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      {/* <div className="p-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2">
          <GoToPreviousPage>
            {(props: RenderGoToPageProps) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={props.onClick}
                disabled={props.isDisabled}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </GoToPreviousPage>
          <span className="text-sm">
            <CurrentPageLabel /> of <NumberOfPages />
          </span>
          <GoToNextPage>
            {(props: RenderGoToPageProps) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={props.onClick}
                disabled={props.isDisabled}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </GoToNextPage>
        </div>
        <div className="flex items-center gap-2">
          <ZoomOutButton>
            {(props: RenderZoomOutProps) => (
              <Button variant="ghost" size="sm" onClick={props.onClick}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            )}
          </ZoomOutButton>
          <Zoom>
            {(props: RenderZoomProps) => (
              <span className="text-sm">{Math.round(props.scale * 100)}%</span>
            )}
          </Zoom>
          <ZoomInButton>
            {(props: RenderZoomInProps) => (
              <Button variant="ghost" size="sm" onClick={props.onClick}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            )}
          </ZoomInButton>
        </div>
      </div> */}

      {/* PDF Content Area */}
      <PDFViewer file={file} />
    </div>
  );
};
