import { CreateGroup, GroupValidationSchema } from "@/schemas/category";
import { CreateCategory } from "@/schemas/category";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
import { Loader } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { HexColorPicker } from "react-colorful";
import { createGroup } from "../actions";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@/components/ui/input";
import { getValidationErrors } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type CreateGroupFormProps = {
  setOpen: (open: boolean) => void;
};

export default function CreateGroupForm({ setOpen }: CreateGroupFormProps) {
  const { toast } = useToast();

  const form = useForm<CreateGroup>({
    resolver: zodResolver(GroupValidationSchema),
    defaultValues: {
      name: "",
      color: "#000000",
    },
  });

  const { execute, isExecuting } = useAction(createGroup, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Group created successfully",
      });
      form.reset();
      setOpen(false);
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

  function onSubmit(data: CreateGroup) {
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
                <Input placeholder="Insert group name" {...field} />
              </FormControl>
              <FormDescription>This is your group name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
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
