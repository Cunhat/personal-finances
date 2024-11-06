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
