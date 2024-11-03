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
    <div>
      <PageHeader title="Categories">
        <div className="ml-2 flex h-full w-full">
          <CreateCategory />
        </div>
      </PageHeader>
    </div>
  );
}
