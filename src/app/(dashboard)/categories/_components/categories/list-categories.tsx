import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { listCategories } from "../../actions";

export async function ListCategories() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const categories = await listCategories();

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-base font-bold">No categories...</h1>
        <p className="text-sm text-muted-foreground">
          Create a category to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center gap-3">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: category.color }}
          ></div>
          <span className="text-sm">{category.icon}</span>
          <div className="text-base">{category.name}</div>
        </div>
      ))}
    </div>
  );
}
