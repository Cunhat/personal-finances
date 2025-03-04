import { PageHeader } from "@/components/page-header";
import PageContainer from "@/components/ui/page-container";
import CreateRecurring from "./_components/create-recurring";
import { eq } from "drizzle-orm";
import { category } from "@/server/db/schema";
import { and } from "drizzle-orm";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Recurring() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const categories = await db.query.category.findMany({
    where: eq(category.userId, user.id),
  });

  return (
    <PageContainer>
      <PageHeader title="Recurring">
        <CreateRecurring categories={categories} />
      </PageHeader>
    </PageContainer>
  );
}
