import React from "react";

type AccountInfoProps = {
  accountId: number;
};

export default function AccountInfo({ accountId }: AccountInfoProps) {
  return <div>{accountId}</div>;
}
