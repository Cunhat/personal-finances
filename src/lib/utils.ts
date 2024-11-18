import { clsx, type ClassValue } from "clsx";
import { ValidationErrors } from "next-safe-action";
import { UseFormReturn, Path } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getValidationErrors<T extends Record<string, any>>(
  validationErrors: ValidationErrors<any>,
  form: UseFormReturn<T>,
) {
  Object.entries(validationErrors).forEach(([key, value]) => {
    form.setError(key as Path<T>, {
      message: Array.isArray(value)
        ? value[0]
        : (value as { _errors?: string[] })?._errors?.[0],
    });
  });
}

/**
 * Generates a random percentage change for balance between -100% and +100%
 * @param options Configuration for percentage generation
 * @returns An object containing the percentage and whether it's an increase
 */
export function generateBalanceChange(options?: {
  minPercentage?: number; // Minimum percentage change (default: -100)
  maxPercentage?: number; // Maximum percentage change (default: 100)
  decimals?: number; // Number of decimal places (default: 2)
}) {
  const {
    minPercentage = -100,
    maxPercentage = 100,
    decimals = 2,
  } = options ?? {};

  // Generate random percentage between min and max
  const percentage = Number(
    (Math.random() * (maxPercentage - minPercentage) + minPercentage).toFixed(
      decimals,
    ),
  );

  // Determine if it's an increase or decrease
  const isIncrease = percentage > 0;

  return {
    percentage: Math.abs(percentage), // Always positive number
    isIncrease,
    formattedPercentage: `${isIncrease ? "+" : "-"}${Math.abs(percentage)}%`,
    multiplier: 1 + percentage / 100, // Useful for calculations
  };
}

export function formatCurrency(
  amount: number,
  options?: {
    locale?: string;
    currency?: string;
  },
) {
  const { locale = "de-DE", currency = "EUR" } = options ?? {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function hexToRgb(hex: string, opacity: number): string | null {
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
