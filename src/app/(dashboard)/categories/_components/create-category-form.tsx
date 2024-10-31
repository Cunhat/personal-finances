import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Button } from "@/components/ui/button";

const CreateCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().emoji(),
});

type FormData = z.infer<typeof CreateCategorySchema>;

export default function CreateCategoryForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateCategorySchema),
  });

  async function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input {...register("name", { required: true })} />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        )}
      </div>
      <div className="flex justify-center">
        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <EmojiPicker
              theme={Theme.DARK}
              previewConfig={{ showPreview: false }}
              onEmojiClick={(emoji) => field.onChange(emoji.emoji)}
            />
          )}
        />
      </div>
      <Button type="submit">Create</Button>
    </form>
  );
}
