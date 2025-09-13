import { useEffect, useState } from "react";
import { COMPANION_URL, COMPANION_ALLOWED_HOSTS } from "@uppy/transloadit";
import Dropbox from "@uppy/dropbox";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Transloadit from "@uppy/transloadit";
import Url from "@uppy/url";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/url/dist/style.min.css";

export const FileUploader = ({
  // onDone,
  transloaditApiKey,
  transloaditTemplateId,
  onUpload,
}: {
  onDone?: (files: (File | Blob)[]) => void;
  onUpload?: (files: File[]) => void;
  transloaditApiKey: string;
  transloaditTemplateId: string;
}) => {
  const [files, setFiles] = useState<(File | Blob)[]>([]);
  // IMPORTANT: passing an initializer function to prevent Uppy from being reinstantiated on every render.
  const [uppy] = useState(() =>
    new Uppy()
      .use(Url, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })
      .use(Dropbox, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })
      .use(Transloadit, {
        assemblyOptions: {
          params: {
            auth: { key: transloaditApiKey },
            template_id: transloaditTemplateId,
          },
        },
      }),
  );

  useEffect(() => {
    const handleUploadSuccess = (file: any, response: any) => {
      if (response.status === 200) {
        console.log("upload-success");
        if (file?.data) {
          setFiles((prevFiles) => [...prevFiles, file.data]);
          let fileData = file.data;
          if (file?.data instanceof Blob && !(file?.data instanceof File)) {
            fileData = new File([file.data], `file-${crypto.randomUUID()}`);
          }
          onUpload?.([fileData as File]);
        }
      } else {
        console.error(response);
      }
    };

    uppy.on("upload-success", handleUploadSuccess);
    return () => {
      uppy.off("upload-success", handleUploadSuccess);
    };
  }, [uppy, onUpload]);

  return (
    <Dashboard
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
      doneButtonHandler={null}
      // doneButtonHandler={() => onDone(files)}
      width="100%"
      height="350px"
    />
  );
};
