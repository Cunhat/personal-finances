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
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker from "@/components/ui/emoji-picker";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
const CreateCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1).emoji(),
  color: z.string().min(1),
});

type FormData = z.infer<typeof CreateCategorySchema>;

export default function CreateCategoryForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
      color: "#000000",
    },
  });

  async function onSubmit(data: FormData) {
    console.log(data);
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
          <Button className="ml-auto" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
