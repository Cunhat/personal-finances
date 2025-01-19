import { Category as CategoryType } from "@/schemas/category";
import { useQueryState } from "nuqs";

type CategoryProps = {
  category: CategoryType;
};

export function Category({ category }: CategoryProps) {
  const [_, setSelectedCategoryId] = useQueryState("categoryId");
  const [__, setSelectedGroupId] = useQueryState("groupId");

  return (
    <div
      key={category.id}
      className="flex items-center gap-3 hover:cursor-pointer"
      onClick={async () => {
        await setSelectedCategoryId(category.id.toString());
        await setSelectedGroupId(null);
      }}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: category.color }}
      ></div>
      <span className="text-sm">{category.icon}</span>
      <div className="text-base">{category.name}</div>
    </div>
  );
}
