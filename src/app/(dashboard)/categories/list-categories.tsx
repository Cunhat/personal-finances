import { db } from "@/server/db";
import { category } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function ListCategories() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const categories = await db.query.category.findMany({
    where: eq(category.userId, user.id),
  });

  return (
    <div className="flex flex-col gap-4">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center gap-3">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: category.color }}
          ></div>
          <span className="text-sm">{category.icon}</span>
          <div className="text-base">{category.name}</div>
        </div>
      ))}
    </div>
  );
}
