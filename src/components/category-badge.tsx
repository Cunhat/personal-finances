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

function hexToRgb(hex: string, opacity: number): string | null {
  if (!hex) return null;
  // Remove the hash if present
  hex = hex.replace(/^#/, "");

  // Parse 3-digit hex
  if (hex.length === 3 && hex[0] && hex[1] && hex[2]) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse the hex values
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex,
  ) as string[];

  if (!result) return null;

  return `rgba(${parseInt(result[1]!, 16)}, ${parseInt(result[2]!, 16)}, ${parseInt(result[3]!, 16)}, ${opacity})`;
}
