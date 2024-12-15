import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NetWorthListAccounts from "./net-worth-list-accounts";
import { Suspense } from "react";

async function NetWorthWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
      </CardHeader>
      <Suspense
        fallback={
          <CardContent>
            <div>Loading...</div>
          </CardContent>
        }
      >
        <NetWorthListAccounts />
      </Suspense>
    </Card>
  );
}

export default NetWorthWidget;
