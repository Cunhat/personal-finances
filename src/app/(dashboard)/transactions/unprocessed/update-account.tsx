import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Account } from "@/schemas/account";
import React from "react";
import { updateUnprocessedTransactionAccount } from "./actions";
import { useAction } from "next-safe-action/hooks";
import { useToast } from "@/hooks/use-toast";

type UpdateAccountProps = {
  accounts: Account[];
  transactionId: string;
  value: string;
};

export default function UpdateAccount({
  accounts,
  transactionId,
  value,
}: UpdateAccountProps) {
  const { toast } = useToast();

  const { execute } = useAction(updateUnprocessedTransactionAccount, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction account updated successfully",
      });
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
    <Select
      onValueChange={(value) => execute({ accountId: value, transactionId })}
      defaultValue={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.id.toString()}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
