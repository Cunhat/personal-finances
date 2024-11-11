import { cva } from "class-variance-authority";
import { TrendingDown, TrendingUp } from "lucide-react";

const BalanceEvolutionTagStyles = cva(
  "rounded-md px-2 py-px flex items-center gap-1",
  {
    variants: {
      isIncrease: {
        true: "bg-green-500/40 border border-green-500",
        false: "bg-red-500/40 border border-red-500",
      },
    },
  },
);

export default function BalanceEvolutionTag({
  percentage,
  isIncrease,
}: {
  percentage: number;
  isIncrease: boolean;
}) {
  return (
    <div className={BalanceEvolutionTagStyles({ isIncrease })}>
      {isIncrease ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}
      <p className="text-sm">{percentage}%</p>
    </div>
  );
}
