"use client";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteTransaction from "./delete-transaction";
import EditTransaction from "./edit-transaction";
import { Account } from "@/schemas/account";
import { Category } from "@/schemas/category";
import { Transaction } from "@/schemas/transaction";
import { Row } from "@tanstack/react-table";

type TransactionTableActionsProps = {
  accounts: Account[];
  categories: Category[];
  transaction: Transaction;
  row: Row<Transaction>;
};

function TransactionTableActions({
  accounts,
  categories,
  transaction,
  row,
}: TransactionTableActionsProps) {
  const [open, setOpen] = useState(false);
  const [openEditSheet, setOpenEditSheet] = useState(false);

  return (
    <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
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
        <EditTransaction
          values={row.original}
          accounts={accounts}
          categories={categories}
          closeSheet={() => setOpenEditSheet(false)}
        />
      </AlertDialog>
    </Sheet>
  );
}

export default TransactionTableActions;
