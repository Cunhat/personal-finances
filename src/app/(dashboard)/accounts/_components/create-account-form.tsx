"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getValidationErrors } from "@/lib/utils";
import { AccountValidation, AccountValidationSchema } from "@/schemas/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { createAccount } from "../actions";
import accountTypes from "./accountTypes.json";

type CreateAccountFormProps = {
  closeSheet: () => void;
};

export default function CreateAccountForm({
  closeSheet,
}: CreateAccountFormProps) {
  const form = useForm<AccountValidation>({
    resolver: zodResolver(AccountValidationSchema),
    defaultValues: {
      balance: 0,
      name: "",
    },
  });

  const { execute, isExecuting } = useAction(createAccount, {
    onSuccess: () => {
      form.reset();
      closeSheet();
    },
    onError: (error) => {
      if (error.error?.validationErrors) {
        getValidationErrors(error.error.validationErrors, form);
      }
    },
  });

  function onSubmit(data: AccountValidation) {
    execute(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Insert account name" {...field} />
              </FormControl>
              <FormDescription>This is your account name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accountTypes.map((accountType) => (
                    <SelectGroup key={accountType.groupId}>
                      <SelectLabel>{accountType.name}</SelectLabel>
                      <SelectSeparator />
                      {accountType.accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the type of account.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="balance"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Initial Balance</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  pattern="^\d*\.?\d{0,2}$"
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => {
                    const value = parseFloat(
                      parseFloat(e.target.value).toFixed(2),
                    );
                    onChange(isNaN(value) ? "" : value);
                  }}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the initial balance of the account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <Button className="ml-auto" type="submit">
            {isExecuting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isExecuting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
