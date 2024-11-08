import { Account } from "@/schemas/account";
import React from "react";

type AccountGroupProps = {
  groupName: string;
  accounts: Array<Account>;
};

export default function AccountGroup({
  groupName,
  accounts,
}: AccountGroupProps) {
  console.log(accounts);
  return (
    <div>
      <h1>{groupName}</h1>
      <div>
        {accounts.map((account) => (
          <div key={account.id}>{account.name}</div>
        ))}
      </div>
    </div>
  );
}
