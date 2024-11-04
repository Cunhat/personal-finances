import { PageHeader } from "@/components/page-header";
import { db } from "@/server/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Finance - Dashboard",
  description: "Track your finances",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function Page() {
  const groups = await db.query.categoryGroup.findMany();

  return (
    <div>
      <PageHeader title="Dashboard"></PageHeader>
    </div>
  );
}
