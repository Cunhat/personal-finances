"use client";

import { DataTable } from "@/components/table/data-table";
import { Transaction } from "@/schemas/transaction";
import React from "react";
import { columns } from "./transactions-columns";
import { SortingState } from "@tanstack/react-table";

export default function ListTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const defaultSorting: SortingState = [{ id: "created_at", desc: true }];
  return (
    <div className="flex h-full w-full overflow-hidden">
      <DataTable
        defaultSorting={defaultSorting}
        columns={columns}
        data={transactions}
      />
    </div>
  );
}
