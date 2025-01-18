import React, { useState } from "react";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, PieChart, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAction } from "next-safe-action/hooks";
import { toast, useToast } from "@/hooks/use-toast";
import {
  deleteUnprocessedTransactions,
  updateBulkUnprocessedTransactionCategory,
} from "../unprocessed/actions";
import { UnprocessedTransaction } from "@/schemas/unprocessed-transactions";
import { Button } from "@/components/ui/button";
import { Account } from "@/schemas/account";
import { Category } from "@/schemas/category";

type TableBulkActionsProps = {
  table: Table<UnprocessedTransaction>;
  accounts: Account[];
  categories: Category[];
};

export default function TableBulkActions({
  table,
  accounts,
  categories,
}: TableBulkActionsProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { toast } = useToast();

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  console.log(selectedIds);

  const { execute, isExecuting } = useAction(deleteUnprocessedTransactions, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transactions deleted successfully",
      });
      setOpenDeleteDialog(false);
      table.setRowSelection({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.error.serverError,
        variant: "destructive",
      });
    },
  });

  const editBulkCategory = useAction(updateBulkUnprocessedTransactionCategory, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transactions category updated successfully",
      });
      table.setRowSelection({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.error.serverError,
        variant: "destructive",
      });
    },
  });

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={selectedIds.length === 0}>
          <EllipsisVertical
            size={16}
            className="text-muted-foreground hover:cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PieChart />
                <span>Set Category</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="max-h-[500px] overflow-y-auto">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onSelect={() => {
                        editBulkCategory.execute({
                          categoryId: category.id.toString(),
                          transactionId: selectedIds.filter(
                            (id) => id !== undefined,
                          ),
                        });
                      }}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <Trash2 size={16} className="text-red-500" />
              <p className="text-red-500">Delete</p>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            transactions from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isExecuting}
            onClick={() =>
              execute(selectedIds.filter((id) => id !== undefined))
            }
          >
            {isExecuting ? "Deleting..." : "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
