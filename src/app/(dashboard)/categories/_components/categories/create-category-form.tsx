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
import { getValidationErrors } from "@/lib/utils";
import { CategoryValidationSchema, CreateCategory } from "@/schemas/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { HexColorPicker } from "react-colorful";
import { Controller, useForm } from "react-hook-form";
import { createCategory } from "../../actions";
import { useToast } from "@/hooks/use-toast";

export default function CreateCategoryForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();

  const form = useForm<CreateCategory>({
    resolver: zodResolver(CategoryValidationSchema),
    defaultValues: {
      name: "",
      icon: "",
      color: "#000000",
    },
  });

  const { execute, isExecuting } = useAction(createCategory, {
    onSuccess: () => {
      form.reset();
      setOpen(false);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    },
    onError: (error) => {
      if (error.error?.validationErrors) {
        getValidationErrors(error.error.validationErrors, form);
      }
      toast({
        title: "Error",
        description: error.error.serverError,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: CreateCategory) {
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
                <Input placeholder="Insert category name" {...field} />
              </FormControl>
              <FormDescription>This is your category name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emoji</FormLabel>
              <FormControl>
                <Input placeholder="Insert emoji" {...field} />
              </FormControl>
              <FormDescription>This is your category emoji.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emoji</FormLabel>
              <FormControl>
                <div className="flex w-full items-center justify-center gap-2">
                  <HexColorPicker
                    color={field.value}
                    onChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <Button className="ml-auto" type="submit" disabled={isExecuting}>
            {isExecuting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isExecuting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
