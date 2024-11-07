import { db } from "@/server/db";
import { categoryGroup } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

export default async function ListGroups() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const groups = await db.query.categoryGroup.findMany({
    where: eq(categoryGroup.userId, user.id),
  });

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {groups.map((group) => (
        <div key={group.id}>{group.name}</div>
      ))}
    </div>
  );
}