import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1).emoji(),
  color: z.string().min(1),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;