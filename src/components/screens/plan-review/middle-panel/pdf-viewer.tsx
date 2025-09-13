import { useAppStore } from "@/providers/app-store-provider";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Printer,
  Edit,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef } from "react";
import { createStore } from "@react-pdf-viewer/core";
import { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

export const pdfStore = createStore({
  currentPage: 0,
});

export const PDFViewer = ({
  pageNavigationPlugin,
}: {
  pageNavigationPlugin: PageNavigationPlugin;
}) => {
  const { setTab, setPclMode } = useAppStore((state) => state);
  const viewerRef = useRef<Viewer | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      fullScreenPlugin: {
        enableShortcuts: true,
      },
      searchPlugin: {
        keyword: [""],
      },
    },
  });

  return (
    <div className="h-full w-full overflow-hidden rounded-lg flex flex-col">
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <button onClick={() => setTab("code-review")}>
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h3 className="text-sm font-medium text-gray-600">
            Plan Check Letter
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md overflow-hidden border border-gray-300 mr-2">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none bg-gray-100`}
              onClick={() => {
                setPclMode("view");
              }}
            >
              <FileText className="h-4 w-4 mr-1" />
              View PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none`}
              onClick={() => setPclMode("edit")}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-sm"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-sm"
            onClick={() => window.open("/plan-check-letter.pdf", "_blank")}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 text-sm">
                Actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTab("code-review")}>
                Back to Analysis
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Viewer
          fileUrl="/plan-check-letter-rescope.pdf"
          plugins={[defaultLayoutPluginInstance, pageNavigationPlugin]}
          // store={pdfStore}
          ref={viewerRef}
        />
      </div>
    </div>
  );
};
