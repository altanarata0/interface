import { useState } from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileUploadStepProps {
  onDone: (files: any[]) => Promise<void>;
  onCancel: () => void;
  transloaditApiKey: string;
  transloaditTemplateId: string;
}

export const FileUploadStep = (props: FileUploadStepProps) => {
  const [hasUploadedFiles, setHasUploadedFiles] = useState<boolean>(false);
  return (
    <>
      <div className="flex flex-col">
        {
          <DialogHeader className="bg-[#fafafa] p-3">
            <DialogTitle className="font-medium text-[#333] text-sm text-center p-0">
              Add project files
            </DialogTitle>
            <DialogDescription className="sr-only">
              Upload files for this project
            </DialogDescription>
          </DialogHeader>
        }

        <FileUploader
          transloaditApiKey={props.transloaditApiKey}
          transloaditTemplateId={props.transloaditTemplateId}
          onUpload={(files) => {
            setHasUploadedFiles(true);
          }}
        />
      </div>
    </>
  );
};
