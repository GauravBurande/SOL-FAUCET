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

// this ai slop is not working! I just asked it to make it better!
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  seconds: number
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, seconds * 1000);
  };
}
