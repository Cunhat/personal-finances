import { PageHeader } from "@/components/page-header";
import CreateCategory from "./_components/create-category";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { category } from "@/server/db/schema";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const categories = await db.query.category.findMany({
    where: eq(category.userId, user.id),
  });

  return (
    <div className="flex-1">
      <PageHeader title="Categories">
        <div className="ml-2 flex h-full w-full">
          <CreateCategory />
        </div>
      </PageHeader>
      <div className="grid flex-1 grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="grid grid-cols-[8px_10px_1fr] items-center gap-2"
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-sm">{category.icon}</span>
              <div className="text-base">{category.name}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-4"></div>
      </div>
    </div>
  );
}
