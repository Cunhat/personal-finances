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
import { Separator } from "@/components/ui/separator";

export default async function Recurring() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const categoriesQuery = db.query.category.findMany({
    where: eq(category.userId, user.id),
  });

  const recurringQuery = db.query.recurringTransaction.findMany({
    where: eq(recurringTransaction.userId, user.id),
    with: {
      category: true,
    },
  });

  const [categories, recurring] = await Promise.all([
    categoriesQuery,
    recurringQuery,
  ]);

  const totalMonthlyFullYear: {
    month: number;
    total: number;
  }[] = [];

  const frequencyOptions = [
    { label: "monthly", value: 1 },
    { label: "bimonthly", value: 2 },
    { label: "quarterly", value: 3 },
    { label: "fourmonths", value: 4 },
    { label: "semiannually", value: 6 },
    { label: "annually", value: 12 },
  ];
  let mapFullYearForEachRecurring: {
    [key: string]: Array<{ month: number; total: number }>;
  } = {};

  recurring.forEach((r) => {
    let currentDate = dayjs().startOf("year").startOf("month");
    const frequency = frequencyOptions.find(
      (f) => f.label === r.interval,
    )?.value!;
    let firstOcc = dayjs(r.firstOccurrence);

    const yearRec = [];

    while (currentDate.isBefore(dayjs().endOf("year"))) {
      if (currentDate.isSame(firstOcc, "month")) {
        yearRec.push({ month: currentDate.month(), total: r.value });
        firstOcc = firstOcc.add(frequency, "month");
      } else {
        yearRec.push({ month: currentDate.month(), total: 0 });
      }

      currentDate = currentDate.add(1, "month");
    }

    mapFullYearForEachRecurring = {
      ...mapFullYearForEachRecurring,
      [r.name]: yearRec,
    };
  });

  console.log(mapFullYearForEachRecurring);

  return (
    <PageContainer>
      <PageHeader title="Recurring">
        <CreateRecurring categories={categories} />
      </PageHeader>
      <div className="grid h-full grid-cols-[1fr_auto_1fr] gap-4">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Total Monthly</h3>
                  <p className="text-sm text-muted-foreground">
                    Total of all your recurring expenses for the month
                  </p>
                </div>
                <div className="text-3xl font-bold">
                  {recurring
                    .filter((r) => r.interval === "monthly")
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
              <CategoryBadge category={recurring.category!} />
              <p className="text-end">{recurring.value} €</p>
            </div>
          ))}
        </div>
        <Separator orientation="vertical" />
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Total Annual</h3>
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
        </div>
      </div>
    </PageContainer>
  );
}
