"use client";

import React, { useState } from "react";
import FileDropZone from "./file-drop-zone";
import { UnprocessedTransaction } from "@/schemas/unprocessed-transactions";
import { Button } from "@/components/ui/button";
import UnprocessedTransactionsTable from "./unprocessed-transactions-table";
import { Loader, Loader2, RefreshCw } from "lucide-react";
import { createUnprocessedTransactions } from "../actions";
import { useAction } from "next-safe-action/hooks";

export default function UploadFile() {
  const [data, setData] = useState<UnprocessedTransaction[]>([]);

  const { execute, isExecuting } = useAction(createUnprocessedTransactions, {
    onSuccess: () => {
      setData([]);
    },
  });

  if (data.length > 0) {
    return (
      <div className="flex w-full flex-col gap-4 overflow-hidden">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Review your transactions</h2>
          <Button
            variant="outline"
            onClick={() => setData([])}
            className="ml-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button onClick={() => execute(data)} disabled={isExecuting}>
            {isExecuting && <Loader className="mr-2 animate-spin" />}
            {isExecuting ? "Submitting..." : "Submit"}
          </Button>
        </div>
        <UnprocessedTransactionsTable data={data} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h2 className="text-left text-xl font-bold">
        Upload your CSV file with your transactions
      </h2>
      <div className="flex flex-1 flex-col items-center gap-4">
        <FileDropZone setData={setData} />
      </div>
    </div>
  );
}
