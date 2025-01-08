import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { getAccounts } from "@/app/(dashboard)/accounts/actions";
import dayjs from "dayjs";
import { NetWorthVarianceChart } from "./net-worth-variance-chart";
import { Account } from "@/schemas/account";
import { getAccountsNetWorth } from "@/app/(dashboard)/accounts/_components/utils";

export default async function NetWorthVariance() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  const accounts = await getAccounts(user.id);

  if (!accounts.length) {
    return <div>No accounts found</div>;
  }

  const netWorthByAccount = getAccountsNetWorth(accounts as Account[]);

  const currentDate = dayjs();

  let iterationDate = dayjs().subtract(1, "year").startOf("month");
  const globalNetWorth: { month: string; value: number }[] = [];

  while (dayjs(iterationDate).isBefore(dayjs(currentDate))) {
    let amountCurrMonth = 0;

    netWorthByAccount.forEach((account) => {
      const valueForAccount = account.netWorth.find((elem) =>
        dayjs(elem.date).isSame(dayjs(iterationDate), "month"),
      );

      if (valueForAccount) {
        amountCurrMonth += valueForAccount.value;
      }
    });

    globalNetWorth.push({
      month: iterationDate.format("MMM YYYY"),
      value: amountCurrMonth,
    });

    iterationDate = iterationDate.add(1, "month");
  }

  return <NetWorthVarianceChart data={globalNetWorth} />;
}
