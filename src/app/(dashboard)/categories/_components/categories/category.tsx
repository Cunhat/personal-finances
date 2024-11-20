import { Category as CategoryType } from "@/schemas/category";

type CategoryProps = {
  category: CategoryType;
  onClick?: () => void;
};

export function Category({ category, onClick }: CategoryProps) {
  return (
    <div
      key={category.id}
      className="flex items-center gap-3 hover:cursor-pointer"
      onClick={onClick}
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
