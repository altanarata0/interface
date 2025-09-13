import { useAppStore } from "@/providers/app-store-provider";
import { AnnotateFiles } from "./middle-panel/annotate-files";
import { PDFViewer } from "./middle-panel/pdf-viewer";
import { TipTapEditor } from "./middle-panel/tiptap-editor";
import { FileViewer } from "./left-panel/file-viewer";
import { Editor } from "@tiptap/core";
import { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { useMemo } from "react";

export const MiddlePanel = ({
  editor,
  pageNavigationPlugin,
}: {
  editor: Editor | null;
  pageNavigationPlugin: PageNavigationPlugin;
}) => {
  const { tab, pclMode, selectedFileId, getFileById } = useAppStore(
    (state) => state,
  );
  const selectedFile = useMemo(
    () => getFileById(selectedFileId ?? ""),
    [selectedFileId, getFileById],
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full w-full border-gray-300 border flex flex-col">
      <div className="flex-1 overflow-hidden">
        {tab === "code-review" && <AnnotateFiles />}
        {tab === "files" && selectedFile && <FileViewer file={selectedFile} />}
        {tab === "pcl" && pclMode === "view" && (
          <PDFViewer pageNavigationPlugin={pageNavigationPlugin} />
        )}
        {tab === "pcl" && pclMode === "edit" && (
          <TipTapEditor editor={editor} />
        )}
      </div>
    </div>
  );
};
