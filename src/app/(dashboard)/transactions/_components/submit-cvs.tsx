"use client";
import type { UnprocessedTransaction } from "@/schemas/unprocessed-transactions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { normalizeSpaces } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUnprocessedTransactions } from "../csv-upload/actions";

type CsvRow = Record<string, string>;

interface CsvData {
  data: CsvRow[];
  meta: {
    fields: string[];
  };
}

interface SubmitCvsProps {
  data: CsvData;
}

export default function SubmitCvs({ data }: SubmitCvsProps) {
  const [selectedName, setSelectedName] = useState<string>();
  const [selectedValue, setSelectedValue] = useState<string>();
  const [selectedCreatedAt, setSelectedCreatedAt] = useState<string>();
  const router = useRouter();

  const fields = data.meta.fields ?? [];

  const { execute, isExecuting } = useAction(createUnprocessedTransactions, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transactions uploaded successfully",
      });
      router.push("/transactions/unprocessed");
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error",
        description: error.error.serverError,
        variant: "destructive",
      });
    },
  });

  function handleSubmit() {
    const parsedData: UnprocessedTransaction[] = data.data.map(
      (row: CsvRow) => {
        if (!selectedValue || !selectedName || !selectedCreatedAt) {
          throw new Error("Required fields not selected");
        }

        const amountStr =
          row[selectedValue]?.toString().replace(/\./g, "").replace(",", ".") ??
          "0";

        const value = parseFloat(amountStr);

        return {
          name: normalizeSpaces(row[selectedName] ?? ""),
          value: value < 0 ? value * -1 : value,
          created_at: row[selectedCreatedAt] ?? new Date().toISOString(),
          transactionType: value > 0 ? "income" : "expense",
          categoryId: null,
          userId: "",
          accountId: null,
        };
      },
    );

    execute(parsedData);
  }

  return (
    <div className="grid w-full grid-rows-3 gap-4">
      <div className="flex items-center justify-between">
        <p>Name:</p>
        <Select
          onValueChange={(value) => setSelectedName(value)}
          value={selectedName}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Name..." />
          </SelectTrigger>
          <SelectContent>
            {fields
              .map((field) => (field === "" ? "- -" : field))
              .map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <p>Value:</p>
        <Select
          onValueChange={(value) => setSelectedValue(value)}
          value={selectedValue}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Value..." />
          </SelectTrigger>
          <SelectContent>
            {fields
              .map((field) => (field === "" ? "- -" : field))
              .map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <p>Created at:</p>
        <Select
          onValueChange={(value) => setSelectedCreatedAt(value)}
          value={selectedCreatedAt}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Created at..." />
          </SelectTrigger>
          <SelectContent>
            {fields
              .map((field) => (field === "" ? "- -" : field))
              .map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-end">
        <Button
          disabled={!selectedName || !selectedValue || !selectedCreatedAt}
          onClick={() => handleSubmit()}
        >
          {isExecuting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          {isExecuting ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}
