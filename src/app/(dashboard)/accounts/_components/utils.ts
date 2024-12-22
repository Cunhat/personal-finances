import { Account } from "@/schemas/account";
import dayjs from "dayjs";

export const getAccountsNetWorthVariance = (accounts: Account[]) => {
  const netWorthByAccount: {
    account: string;
    accountId: number;
    netWorth: { date: string; value: number }[];
  }[] = [];
  const currentDate = dayjs();

  accounts.forEach((account) => {
    const netWorthByAccountTest = [];

    if (account?.transaction?.length) {
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
      accountId: account.id,
      netWorth: netWorthByAccountTest,
    });
  });

  return netWorthByAccount;
};
