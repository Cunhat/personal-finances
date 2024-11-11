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

interface BalanceEvolutionTagProps {
  percentage: number;
  isIncrease: boolean;
}

export default function BalanceEvolutionTag({
  percentage,
  isIncrease,
}: BalanceEvolutionTagProps) {
  if (typeof percentage !== 'number' || isNaN(percentage)) {
    return null;
  }

  const label = `Balance ${isIncrease ? 'increased' : 'decreased'} by ${percentage}%`;

  return (
    <div 
      className={BalanceEvolutionTagStyles({ isIncrease })}
      role="status"
      aria-label={label}
    >
      {isIncrease ? (
        <TrendingUp className="h-4 w-4" aria-hidden="true" />
      ) : (
        <TrendingDown className="h-4 w-4" aria-hidden="true" />
      )}
      <p className="text-sm">{percentage.toFixed(2)}%</p>
    </div>
  );
}
