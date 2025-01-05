"use client";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { deleteTransaction } from "../actions";
import { useToast } from "@/hooks/use-toast";

type DeleteTransactionProps = {
  transactionId: number;
  closeSheet: () => void;
};

export default function DeleteTransaction({
  transactionId,
  closeSheet,
}: DeleteTransactionProps) {
  const { toast } = useToast();

  const { execute, isExecuting } = useAction(deleteTransaction, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      closeSheet();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.error.serverError,
        variant: "destructive",
      });
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          transaction from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isExecuting}>Cancel</AlertDialogCancel>
        <Button
          disabled={isExecuting}
          onClick={() => execute({ id: transactionId })}
        >
          {isExecuting ? "Deleting..." : "Confirm"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
