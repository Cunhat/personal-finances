"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Transaction,
  TransactionValidationSchema,
} from "@/schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTransaction, updateTransaction } from "../actions";
import { cn, getValidationErrors } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { CalendarIcon, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Account } from "@/schemas/account";
import { Category } from "@/schemas/category";

export default function EditTransaction({
  values,
  accounts,
  categories,
  closeSheet,
}: {
  values: Transaction;
  accounts: Account[];
  categories: Category[];
  closeSheet: () => void;
}) {
  const form = useForm<z.infer<typeof TransactionValidationSchema>>({
    resolver: zodResolver(TransactionValidationSchema),
    defaultValues: {
      name: values.name,
      amount: values.value,
      date: dayjs(values.created_at).toDate(),
      category: values.categoryId.toString(),
      account: values.accountId.toString(),
      transactionType: values.transactionType,
    },
  });

  const { execute, isExecuting } = useAction(updateTransaction, {
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

  function onSubmit(formValues: z.infer<typeof TransactionValidationSchema>) {
    try {
      execute({ id: values.id, ...formValues });
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <SheetContent className="flex flex-col gap-4">
      <SheetHeader>
        <SheetTitle>Edit Transaction</SheetTitle>
        <SheetDescription>Edit a transaction.</SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-6 2xl:space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Transaction name" type="" {...field} />
                </FormControl>
                <FormDescription>
                  This is your transaction name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transactionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a transaction type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of the transaction.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id.toString()}
                      >
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the account of the transaction.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value).format("DD/MM/YYYY")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the date of the transaction.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span className="text-xs text-muted-foreground">
                            {category.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the category of the transaction.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
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
                  This is the amount of the transaction.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex">
            <Button className="ml-auto" type="submit" disabled={isExecuting}>
              {isExecuting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isExecuting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </SheetContent>
  );
}
