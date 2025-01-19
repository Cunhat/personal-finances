"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { cn, formatCurrency } from "@/lib/utils";
import { Account } from "@/schemas/account";
import { Category } from "@/schemas/category";
import { UnprocessedTransaction } from "@/schemas/unprocessed-transactions";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { processUnprocessedTransactions } from "./actions";
import UpdateAccount from "./update-account";
import UpdateCategory from "./update-category";
import TableBulkActions from "../_components/table-bulk-actions";

type UnprocessedTransactionsTableProps = {
  data: UnprocessedTransaction[];
  accounts: Account[];
  categories: Category[];
};

export default function UnprocessedTransactionsTable({
  data,
  accounts,
  categories,
}: UnprocessedTransactionsTableProps) {
  const columns: ColumnDef<UnprocessedTransaction>[] = useMemo(
    () => [
      {
        accessorKey: "selected",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
              className="translate-y-[2px]"
            />
          );
        },
        cell: ({ row }) => {
          const id = row.original.id;
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          );
        },
      },
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
        accessorKey: "account",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Account" />
        ),
        cell: ({ row }) => {
          return (
            <UpdateAccount
              accounts={accounts}
              transactionId={row.original.id?.toString() ?? ""}
              value={row.original.accountId?.toString() ?? ""}
            />
            // <div className="w-full text-xl text-white">TEST account</div>
          );
        },
      },
      {
        accessorKey: "categoryId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => {
          return (
            <UpdateCategory
              categories={categories}
              value={row?.original?.categoryId?.toString() ?? ""}
              transactionId={row?.original?.id?.toString() ?? ""}
            />
            // <div className="w-full text-xl text-white">TEST category</div>
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
      {
        accessorKey: "actions",
        header: ({ table }) => (
          <TableBulkActions
            accounts={accounts}
            categories={categories}
            table={table}
            transactions={data}
          />
        ),
        cell: "",
      },
    ],
    [accounts, categories],
  );

  const defaultSorting: SortingState = [{ id: "created_at", desc: true }];

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        defaultSorting={defaultSorting}
      />
    </div>
  );
}
