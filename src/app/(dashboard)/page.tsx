import { db } from "@/server/db";

export default async function Page() {
  const groups = await db.query.categoryGroup.findMany();

  console.log(groups);

  return <div>Dashboard</div>;
}
