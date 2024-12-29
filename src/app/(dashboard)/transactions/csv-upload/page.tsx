import { PageHeader } from "@/components/page-header";
import React from "react";
import UploadFile from "./_components/upload-file";

export default function CsvUpload() {
  return (
    <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden">
      <PageHeader title="Upload CSV" />
      <UploadFile />
    </div>
  );
}
