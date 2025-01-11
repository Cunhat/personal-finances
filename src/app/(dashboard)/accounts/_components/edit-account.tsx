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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import {
  Account,
  AccountUpdateValidation,
  AccountUpdateValidationSchema,
  AccountValidation,
  AccountValidationSchema,
} from "@/schemas/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import accountTypes from "./accountTypes.json";
import { useAction } from "next-safe-action/hooks";
import { updateAccount } from "../actions";

type EditAccountProps = {
  account: Account;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function EditAccount({
  account,
  open,
  setOpen,
}: EditAccountProps) {
  const { toast } = useToast();

  const form = useForm<AccountUpdateValidation>({
    resolver: zodResolver(AccountUpdateValidationSchema),
    defaultValues: {
      name: account.name,
      accountType: account.accountType,
      initialBalance: account.initialBalance,
    },
  });

  const { execute, isExecuting } = useAction(updateAccount, {
    onSuccess: () => {
      setOpen(false);
      toast({
        title: "Account updated",
        description: "Your account has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.error.serverError,
      });
    },
  });

  const onSubmit = (data: AccountUpdateValidation) => {
    execute({ id: account.id, ...data });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>Edit your account details</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full space-y-8"
          >
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accountTypes.map((accountType) => (
                        <SelectGroup key={accountType.groupId}>
                          <SelectLabel>{accountType.name}</SelectLabel>
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
              name="initialBalance"
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
              <Button className="ml-auto" type="submit" disabled={isExecuting}>
                {isExecuting && (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isExecuting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
