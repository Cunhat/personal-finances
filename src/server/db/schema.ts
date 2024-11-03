// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const categoryGroup = sqliteTable("category_group", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  color: text("color").notNull(),
});

export const category = sqliteTable("category", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  userId: text("user_id").notNull(),
  groupId: integer("group_id").references(() => categoryGroup.id),
});

export const account = sqliteTable("account", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  accountType: text("account_type").notNull(),
  userId: text("user_id").notNull(),
  balance: real("balance").notNull(),
});

export const transaction = sqliteTable("transaction", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({ autoIncrement: true }),
  value: real("value").notNull(),
  created_at: text("created_at").notNull(),
  transactionType: text("transaction_type", { enum: ["expense", "income"] as const }).notNull(),
  categoryId: integer("category_id").references(() => category.id).notNull(),
  userId: text("user_id").notNull(),
  accountId: integer("account_id").references(() => account.id).notNull(),
});
