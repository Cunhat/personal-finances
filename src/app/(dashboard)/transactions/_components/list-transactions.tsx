"use client";

import CategoryBadge from "@/components/category-badge";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Account } from "@/schemas/account";
import { Category } from "@/schemas/category";
import { Transaction } from "@/schemas/transaction";
import { SortingState } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import TransactionTableActions from "./transaction-table-actions";
import {
  AccountFilter,
  AccountFilterFn,
} from "@/components/table/filters/account-filter";

export default function ListTransactions({
  accounts,
  categories,
  transactions,
}: {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
}) {
  const columns: ColumnDef<Transaction>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
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
      accessorKey: "account",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account" />
      ),
      cell: ({ row }) => {
        const account: Account = row.getValue("account");

        return (
          <div className="flex items-center">
            <span>{account.name ?? "-"}</span>
          </div>
        );
      },
      filterFn: AccountFilterFn,
      meta: {
        filterComponent: AccountFilter,
        filterLabel: "Account",
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
              {dayjs(row.getValue("created_at")).format("DD/MM/YYYY HH:mm") ??
                "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const category: Category = row.getValue("category");

        return (
          <div className="flex items-center">
            <CategoryBadge category={category} />
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
              {row.getValue("value") ?? "-"} €
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "",
      header: "",
      id: "actions",
      cell: ({ row }) => {
        return (
          <TransactionTableActions
            accounts={accounts}
            categories={categories}
            transaction={row.original}
            row={row}
          />
        );
      },
    },
  ];

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
