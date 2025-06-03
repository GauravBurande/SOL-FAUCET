import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(
  amount: string | number,
  decimals: number,
  precision = 6
) {
  if (!amount) return "0";
  return (Number(amount) / 10 ** decimals)
    .toFixed(precision)
    .replace(/\.?0+$/, "");
}
