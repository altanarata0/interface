import { ProjectFile } from "@/components/screens/projects-tracker/types";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export const PDFViewer = ({ file }: { file: ProjectFile }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="flex-1 bg-gray-200 overflow-auto">
      <Viewer
        fileUrl={file.url}
        key={file.url} // Add key here
        plugins={[
          // pageNavigationPluginInstance,
          // zoomPluginInstance,
          defaultLayoutPluginInstance,
        ]}
      />
    </div>
  );
};
