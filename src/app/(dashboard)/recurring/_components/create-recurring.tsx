"use client";

import { useState, type ReactNode } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/schemas/category";
import dayjs from "dayjs";
import { createRecurring } from "../actions";
import { useAction } from "next-safe-action/hooks";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  frequency: z.string({
    required_error: "Please select a frequency.",
  }),
  firstOccurrence: z.date({
    required_error: "Please select a date.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
});

// Define the frequency options
const frequencyOptions = [
  { value: "monthly", label: "Every month" },
  { value: "bimonthly", label: "Every 2 months" },
  { value: "quarterly", label: "Every 3 months" },
  { value: "fourmonths", label: "Every 4 months" },
  { value: "semiannually", label: "Every 6 months" },
  { value: "annually", label: "Annually" },
];

// Define the category options

type CreateRecurringProps = {
  categories: Category[];
};

export default function CreateRecurring({ categories }: CreateRecurringProps) {
  const [open, setOpen] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: undefined,
      frequency: "monthly",
      firstOccurrence: dayjs().toDate(),
      category: "",
    },
  });

  const { execute, isExecuting } = useAction(createRecurring, {
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    execute({
      name: values.name,
      value: values.amount,
      interval: values.frequency,
      firstOccurrence: values.firstOccurrence,
      category: values.category,
    });
    // Here you would typically save the data to your database
    // For now, we'll just close the sheet
  }

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        form.reset();
      }}
    >
      <SheetTrigger asChild>
        <Button className="ml-auto">Add</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Recurring Expense</SheetTitle>
          <SheetDescription>
            Add a new recurring transaction to track your subscriptions and
            regular expenses.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Netflix Subscription" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a name for this recurring expense.
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
                      {/* <Input
                        type="number"
                        placeholder="15.99"
                        step="0.01"
                        {...field}
                      /> */}
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
                      Enter the amount for each occurrence.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select how often this expense repeats" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often does this expense occur?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstOccurrence"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>First Occurrence</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              dayjs(field.value).format("DD/MM/YYYY")
                            ) : (
                              <span>Pick a date</span>
                            )}
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
                      When did/will this expense first occur?
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
                        {categories.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <span>{option.icon}</span>
                              <span className="text-xs text-muted-foreground">
                                {option.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Categorize this expense for better tracking.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit" disabled={isExecuting}>
                  {isExecuting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isExecuting ? "Saving..." : "Save Expense"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
