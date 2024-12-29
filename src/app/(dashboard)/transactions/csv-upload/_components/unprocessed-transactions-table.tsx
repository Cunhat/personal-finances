import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatCurrency } from "@/lib/utils";
import { UnprocessedTransaction } from "@/schemas/unprocessed-transactions";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import React from "react";

type UnprocessedTransactionsTableProps = {
  data: UnprocessedTransaction[];
};

export default function UnprocessedTransactionsTable({
  data,
}: UnprocessedTransactionsTableProps) {
  const columns: ColumnDef<UnprocessedTransaction>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span>{row.getValue("name") ?? "-"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span>
              {dayjs(row.getValue("created_at")).format("DD/MM/YYYY") ?? "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "value",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Value" />
      ),
      cell: ({ row }) => {
        const isIncome = row.original.transactionType === "income";

        return (
          <div className="flex items-center">
            <span className={cn(isIncome ? "text-green-500" : "")}>
              {formatCurrency(row.getValue("value")) ?? "-"}
            </span>
          </div>
        );
      },
    },
  ];

  const defaultSorting: SortingState = [{ id: "created_at", desc: true }];

  return (
    <DataTable columns={columns} data={data} defaultSorting={defaultSorting} />
  );
}
