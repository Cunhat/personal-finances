import { PageHeader } from "@/components/page-header";
import PageContainer from "@/components/ui/page-container";
import CreateRecurring from "./_components/create-recurring";
import { eq } from "drizzle-orm";
import { category, recurringTransaction } from "@/server/db/schema";
import { and } from "drizzle-orm";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import CategoryBadge from "@/components/category-badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function Recurring() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const categories = await db.query.category.findMany({
    where: eq(category.userId, user.id),
  });

  const recurring = await db.query.recurringTransaction.findMany({
    where: eq(recurringTransaction.userId, user.id),
    with: {
      category: true,
    },
  });

  return (
    <PageContainer>
      <PageHeader title="Recurring">
        <CreateRecurring categories={categories} />
      </PageHeader>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    Total Annual Recurring Expenses
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Total of all your recurring expenses for the year
                  </p>
                </div>
                <div className="text-3xl font-bold">
                  {recurring
                    .reduce((acc, curr) => acc + curr.value, 0)
                    .toFixed(2)}
                  €
                </div>
              </div>
            </CardContent>
          </Card>
          {recurring.map((recurring) => (
            <div
              className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-2"
              key={recurring.id}
            >
              <p className="col-span-1 text-xs text-muted-foreground">
                {dayjs(recurring.firstOccurrence).format("D MMM")}
              </p>
              <div className="col-span-1 flex items-center gap-2">
                <span>{recurring.name}</span>
                <span className="text-xs text-muted-foreground">
                  {recurring.interval}
                </span>
              </div>
              <CategoryBadge category={recurring.category} />
              <p className="text-end">{recurring.value} €</p>
            </div>
          ))}
        </div>
        <div></div>
      </div>
    </PageContainer>
  );
}
