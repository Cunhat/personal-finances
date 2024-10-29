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
  groupId: integer("group_id").references(() => categoryGroup.id),
});
