import { Account } from "@/schemas/account";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAccounts } from "../actions";
import SplitAccountsView from "./split-accounts-view";

type ListAccountsProps = {
  accountId: string | undefined;
};

export default async function ListAccounts({ accountId }: ListAccountsProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const accounts = await getAccounts(user.id);

  if (!accounts.length) {
    return <div>No accounts found</div>;
  }

  return (
    <SplitAccountsView accounts={accounts as Account[]} accountId={accountId} />
  );
}
