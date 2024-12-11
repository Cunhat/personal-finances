import CategoryBadge from "@/components/category-badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Account } from "@/schemas/account";
import { Category } from "@/schemas/category";
import { Transaction } from "@/schemas/transaction";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { EllipsisVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import CreateAccountForm from "../../accounts/_components/create-account-form";
import DeleteTransaction from "./delete-transaction";
import { useState } from "react";

export const columns: ColumnDef<Transaction>[] = [
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
      return (
        <div className="flex items-center">
          <span>{row.getValue("value") ?? "-"} €</span>
        </div>
      );
    },
  },
  {
    accessorKey: "",
    header: "",
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);

      return (
        <Sheet>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="size-8">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <SheetTrigger asChild>
                  <DropdownMenuItem>
                    <Pencil />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </SheetTrigger>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <Trash2 className="text-red-500" />
                    <span className="text-red-500">Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteTransaction
              closeSheet={() => setOpen(false)}
              transactionId={row.original.id}
            />
            <SheetContent className="flex flex-col gap-4">
              <SheetHeader>
                <SheetTitle>Add Account</SheetTitle>
                <SheetDescription>Add a new account.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </AlertDialog>
        </Sheet>
      );
    },
  },
];
