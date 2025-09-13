import * as React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";

interface UploadBlueprintsDialogContentProps {
  transloaditApiKey: string;
  transloaditTemplateId: string;
  onDone: (filesUploaded: boolean) => void; // Modified to pass upload status
}

export const UploadBlueprintsDialogContent: React.FC<
  UploadBlueprintsDialogContentProps
> = ({ transloaditApiKey, transloaditTemplateId, onDone }) => {
  const [hasUploadedFiles, setHasUploadedFiles] =
    React.useState<boolean>(false);

  const handleDone = () => {
    onDone(hasUploadedFiles);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload Blueprints</DialogTitle>
        <DialogDescription className="sr-only">
          Upload your blueprint files.
        </DialogDescription>
      </DialogHeader>
      <div className="px-6 py-4 flex flex-col h-fit min-h-0">
        <div className="h-[350px]">
          <FileUploader
            transloaditApiKey={transloaditApiKey}
            transloaditTemplateId={transloaditTemplateId}
            onUpload={(files) => {
              // Assuming `files` is an array of uploaded file objects
              setHasUploadedFiles(files.length > 0);
            }}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="cursor-pointer transition-none">
            Cancel
          </Button>
        </DialogClose>
        <Button
          className="cursor-pointer transition-none"
          onClick={handleDone}
          // disabled={!hasUploadedFiles}
        >
          Done
        </Button>
      </DialogFooter>
    </>
  );
};
