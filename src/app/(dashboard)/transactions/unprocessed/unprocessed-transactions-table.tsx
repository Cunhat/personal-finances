"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";
import { Account } from "@/schemas/account";
import { Category } from "@/schemas/category";
import { UnprocessedTransaction } from "@/schemas/unprocessed-transactions";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useState } from "react";
import UpdateCategory from "./update-category";
import UpdateAccount from "./update-account";

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
  const [selectedTransactions, setSelectedTransactions] = useState<
    UnprocessedTransaction[]
  >([]);

  const columns: ColumnDef<UnprocessedTransaction>[] = [
    {
      accessorKey: "selected",
      header: () => "",
      cell: () => {
        return <Checkbox className="size-4 rounded-[4px]" />;
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
