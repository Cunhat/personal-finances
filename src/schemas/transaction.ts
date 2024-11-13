import { createSelectSchema } from "drizzle-zod";
import { transaction } from "@/server/db/schema";
import { z } from "zod";

const selectTransaction = createSelectSchema(transaction);

export type Transaction = z.infer<typeof selectTransaction>;
