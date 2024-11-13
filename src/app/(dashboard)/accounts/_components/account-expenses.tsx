import Table from "@/components/table/table";
import { Transaction } from "@/schemas/transaction";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

type AccountExpensesProps = {
  transactions: Transaction[];
};

export default function AccountExpenses({
  transactions,
}: AccountExpensesProps) {
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "name",
      header: "name",
      cell: (info) => info.getValue(),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "created_at",
      header: "created_at",
      cell: (info) => info.getValue(),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "categoryId",
      header: "category",
      cell: (info) => info.getValue(),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "value",
      header: "value",
      cell: (info) => info.getValue(),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return <Table data={transactions ?? []} columns={columns} />;
}
