import { hexToRgb } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Category } from "@/schemas/category";

type CategoryBadgeProps = {
  category: Category;
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const color = hexToRgb(category.color, 0.35);

  return (
    <Badge className="relative w-fit" style={{ backgroundColor: color! }}>
      <p className="pr-1 text-sm">{category.icon}</p>
      <p style={{ color: category.color }}>{category.name}</p>
    </Badge>
  );
}
