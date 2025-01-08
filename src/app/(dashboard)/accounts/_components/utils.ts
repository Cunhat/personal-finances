import { Account } from "@/schemas/account";
import dayjs from "dayjs";

type NetWorthByAccount = {
  account: string;
  accountId: number;
  netWorth: { date: string; value: number }[];
};

export const getAccountsNetWorth = (accounts: Account[]) => {
  const netWorthByAccount: NetWorthByAccount[] = [];

  const currentDate = dayjs();

  accounts.forEach((account) => {
    const hasTransaction =
      account?.transaction && account?.transaction?.length > 0;

    let accountCreationDateIterator = hasTransaction
      ? dayjs(
          account?.transaction?.sort((a, b) =>
            dayjs(a.created_at).diff(dayjs(b.created_at), "day"),
          )[0]?.created_at,
        )
      : dayjs(account.createdAt);

    const accountNetWorth: { date: string; value: number }[] = [];

    let balance = account.initialBalance;

    while (
      dayjs(accountCreationDateIterator).isBefore(
        dayjs(currentDate).endOf("month"),
      )
    ) {
      const currentMonthNetWorth =
        account?.transaction
          ?.filter((transaction) =>
            dayjs(transaction.created_at).isSame(
              dayjs(accountCreationDateIterator),
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
          }, 0) ?? 0;

      balance += currentMonthNetWorth;

      console.log(account.name, currentMonthNetWorth, balance);

      accountNetWorth.push({
        date: accountCreationDateIterator.toISOString(),
        value: balance,
      });

      accountCreationDateIterator = accountCreationDateIterator.add(1, "month");
    }

    netWorthByAccount.push({
      account: account.name,
      accountId: account.id,
      netWorth: accountNetWorth,
    });
  });

  console.log(netWorthByAccount);
  return netWorthByAccount;
};
