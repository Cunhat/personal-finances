"use client";

import { useToast } from "@/hooks/use-toast";
import { normalizeSpaces } from "@/lib/utils";
import { UnprocessedTransaction } from "@/schemas/unprocessed-transactions";
import Papa from "papaparse";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type CsvTransaction = {
  DATA_MOVIMENTO: string;
  DATA_OPERACAO: string;
  DESCRICAO: string;
  IMPORTANCIA_MOEDA: number;
  SALDO_CONTABILISTICO: number;
  MOEDA: string;
};

type FileDropZoneProps = {
  setData: (data: UnprocessedTransaction[]) => void;
};

export default function FileDropZone({ setData }: FileDropZoneProps) {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      Papa?.parse(acceptedFiles[0], {
        header: true, // Set to true to parse CSV into an array of objects
        skipEmptyLines: true, // Skip empty lines
        complete: (result: Papa.ParseResult<CsvTransaction>) => {
          console.log(result);
          try {
            const parsedData: UnprocessedTransaction[] = result.data.map(
              (row: CsvTransaction) => {
                // Convert string amount to float by removing dots and replacing comma with dot
                const amountStr = row.IMPORTANCIA_MOEDA.toString()
                  .replace(/\./g, "") // Remove dots (thousand separators)
                  .replace(",", "."); // Replace comma with dot for decimal

                const value = parseFloat(amountStr);

                return {
                  name: normalizeSpaces(row.DESCRICAO),
                  value: value < 0 ? value * -1 : value,
                  created_at: row.DATA_MOVIMENTO,
                  transactionType: value > 0 ? "income" : "expense",
                  categoryId: null,
                  userId: "",
                  accountId: null,
                };
              },
            );

            setData(parsedData);
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4"
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
