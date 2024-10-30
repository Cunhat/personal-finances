import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { EllipsisVertical } from "lucide-react";

export default async function Page() {
  const groups = await db.query.categoryGroup.findMany();

  return (
    <div>
      <PageHeader title="Dashboard"></PageHeader>
    </div>
  );
}
