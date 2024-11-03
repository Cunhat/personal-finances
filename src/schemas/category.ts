import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1).emoji(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;
