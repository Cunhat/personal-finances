"use client";

import { DataTable } from "@/components/table/data-table";
import { Transaction } from "@/schemas/transaction";
import React from "react";
import { columns } from "./transactions-columns";

export default function ListTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="flex h-full w-full overflow-auto">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}
