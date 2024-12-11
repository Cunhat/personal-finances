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

type DeleteTransactionProps = {
  transactionId: number;
  closeSheet: () => void;
};

export default function DeleteTransaction({
  transactionId,
  closeSheet,
}: DeleteTransactionProps) {
  const { execute, isExecuting } = useAction(deleteTransaction, {
    onSuccess: () => {
      closeSheet();
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
