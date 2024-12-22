import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { getAccounts } from "@/app/(dashboard)/accounts/actions";
import dayjs from "dayjs";
import { NetWorthVarianceChart } from "./net-worth-variance-chart";

export default async function NetWorthVariance() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  const accounts = await getAccounts(user.id);

  if (!accounts.length) {
    return <div>No accounts found</div>;
  }

  const netWorthByAccount: {
    account: string;
    netWorth: { date: string; value: number }[];
  }[] = [];

  const currentDate = dayjs();

  accounts.forEach((account) => {
    const netWorthByAccountTest = [];

    if (account.transaction.length) {
      let firstTransactionDate = dayjs(
        account?.transaction?.sort((a, b) =>
          dayjs(a.created_at).diff(dayjs(b.created_at), "day"),
        )[0]?.created_at,
      );

      let accountInitialBalance = account.initialBalance;

      while (dayjs(firstTransactionDate).isBefore(dayjs(currentDate))) {
        const monthlyNetWorth = account.transaction
          .filter((transaction) =>
            dayjs(transaction.created_at).isSame(
              dayjs(firstTransactionDate),
              "month",
            ),
          )
          .reduce((acc, transaction) => {
            if (transaction.transactionType === "income") {
              acc += transaction.value;
            } else {
              acc -= transaction.value;
            }

            return acc;
          }, 0);

        const addCountForAccount = accountInitialBalance + monthlyNetWorth;

        netWorthByAccountTest.push({
          date: firstTransactionDate.toISOString(),
          value: addCountForAccount,
        });

        accountInitialBalance = addCountForAccount;
        firstTransactionDate = firstTransactionDate.add(1, "month");
      }
    } else {
      let createdDate = dayjs(account.createdAt);

      while (dayjs(createdDate).isBefore(dayjs(currentDate))) {
        netWorthByAccountTest.push({
          date: createdDate.toISOString(),
          value: account.initialBalance,
        });

        createdDate = createdDate.add(1, "month");
      }
    }

    netWorthByAccount.push({
      account: account.name,
      netWorth: netWorthByAccountTest,
    });
  });

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

  console.log("globalNetWorth", globalNetWorth);

  return <NetWorthVarianceChart data={globalNetWorth} />;
}
