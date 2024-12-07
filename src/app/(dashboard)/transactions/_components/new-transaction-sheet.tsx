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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, getValidationErrors } from "@/lib/utils";
import { SimpleAccount } from "@/schemas/account";
import { Category } from "@/schemas/category";
import { TransactionValidationSchema } from "@/schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CalendarIcon, Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTransaction } from "../actions";

type NewTransactionSheetProps = {
  accounts: SimpleAccount[];
  categories: Category[];
};

export default function NewTransactionSheet({
  accounts,
  categories,
}: NewTransactionSheetProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof TransactionValidationSchema>>({
    resolver: zodResolver(TransactionValidationSchema),
    defaultValues: {
      name: "",
      amount: 0.0,
    },
  });

  const { execute, isExecuting } = useAction(createTransaction, {
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      if (error.error?.validationErrors) {
        getValidationErrors(error.error.validationErrors, form);
      }
    },
  });

  function onSubmit(values: z.infer<typeof TransactionValidationSchema>) {
    try {
      execute(values);
    } catch (error) {
      console.error("Form submission error", error);
    }
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="ml-auto" size="sm">
          New Transaction
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>
            Create a new transaction for your account.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 py-6"
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
                {isExecuting && (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isExecuting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
