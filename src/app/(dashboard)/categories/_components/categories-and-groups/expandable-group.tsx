import { useState } from "react";
import { Category } from "../categories/category";
import { Group } from "next/dist/shared/lib/router/utils/route-regex";
import { cn, hexToRgb } from "@/lib/utils";
import {
  CategoryGroupWithCategories,
  CategoryWithTransactions,
} from "@/schemas/category";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ExpandableGroupProps = {
  group: CategoryGroupWithCategories;
  onCategorySelect: (category: CategoryWithTransactions | null) => void;
  onGroupSelect: (group: CategoryGroupWithCategories | null) => void;
};

export default function ExpandableGroup({
  group,
  onCategorySelect,
  onGroupSelect,
}: ExpandableGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const numberOfCategories = group?.categories?.length ?? 0;
  const color = hexToRgb(group.color, 0.35) ?? "transparent";

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center gap-2 hover:cursor-pointer"
        onClick={() => {
          onGroupSelect(group);
          onCategorySelect(null);
        }}
      >
        <ChevronRight
          size={16}
          style={{ color: group.color ?? "white" }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-4 w-4 transition-all",
            numberOfCategories > 0 && isOpen && "rotate-90",
          )}
        />
        <div
          className="flex h-5 w-5 items-center justify-center rounded-[4px]"
          style={{ backgroundColor: color }}
        >
          <p style={{ color: group.color }}>{numberOfCategories}</p>
        </div>
        <p>{group.name}</p>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {numberOfCategories > 0 && isOpen && (
          <motion.div
            className="ml-8 flex flex-col gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
          >
            {group.categories?.map((category) => (
              <Category
                key={category.id}
                category={category}
                onClick={() => {
                  onCategorySelect(category);
                  onGroupSelect(null);
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
