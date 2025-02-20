"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitCvs from "./submit-cvs";

export default function UploadCsv() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileUp size={16} />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import transactions.
          </DialogDescription>
        </DialogHeader>
        <FileDropZone />
      </DialogContent>
    </Dialog>
  );
}

function FileDropZone() {
  const [data, setData] = useState<any>(null);

  function onDropFile(acceptedFiles: File[]) {
    if (acceptedFiles[0]) {
      Papa?.parse(acceptedFiles[0], {
        header: true, // Set to true to parse CSV into an array of objects
        skipEmptyLines: true, // Skip empty lines
        complete: (result: Papa.ParseResult<any>) => {
          try {
            setData(result ?? null);
          } catch (error) {
            toast({
              title: "Error parsing CSV",
              description: "Please check the CSV file and try again",
              variant: "destructive",
            });
          }
        },
        error: (error: Error) => {
          console.error("Error parsing CSV: ", error);
        },
      });
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  if (data) {
    return <SubmitCvs data={data} />;
  }

  return (
    <div
      {...getRootProps()}
      className="flex h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag & drop some files here, or click to select files</p>
      )}
    </div>
  );
}
