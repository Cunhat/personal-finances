import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Account } from "@/schemas/account";
import { Category } from "@/schemas/category";
import { UnprocessedTransaction } from "@/schemas/unprocessed-transactions";
import { Table } from "@tanstack/react-table";
import {
  CreditCard,
  EllipsisVertical,
  PieChart,
  Send,
  Trash2,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import {
  deleteUnprocessedTransactions,
  processUnprocessedTransactions,
  updateBulkUnprocessedTransactionAccount,
  updateBulkUnprocessedTransactionCategory,
} from "../unprocessed/actions";

type TableBulkActionsProps = {
  table: Table<UnprocessedTransaction>;
  accounts: Account[];
  categories: Category[];
  transactions: UnprocessedTransaction[];
};

export default function TableBulkActions({
  table,
  accounts,
  categories,
  transactions,
}: TableBulkActionsProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { toast } = useToast();

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

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

  const editBulkAccount = useAction(updateBulkUnprocessedTransactionAccount, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transactions account updated successfully",
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

  const processBulk = useAction(processUnprocessedTransactions, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transactions processed successfully",
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

  function handleProcess() {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    const selectedTransactions = transactions.filter((transaction) =>
      selectedIds.includes(transaction.id),
    );

    processBulk.execute(selectedTransactions);
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
          <DropdownMenuItem onSelect={handleProcess}>
            <Send />
            Process
          </DropdownMenuItem>
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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CreditCard />
                <span>Set Accounts</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="max-h-[500px] overflow-y-auto">
                  {accounts.map((account) => (
                    <DropdownMenuItem
                      key={account.id}
                      onSelect={() => {
                        editBulkAccount.execute({
                          accountId: account.id.toString(),
                          transactionId: selectedIds.filter(
                            (id) => id !== undefined,
                          ),
                        });
                      }}
                    >
                      <span>{account.name}</span>
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
