"use client";
import { Worker } from "@react-pdf-viewer/core";

export const PdfWorkerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      {children}
    </Worker>
  );
};
