import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isArrayOfDates(arr: any[]): arr is Date[] {
  return arr.every((item) => item instanceof Date);
}

export function isArrayOfNumbers(arr: any[]): arr is number[] {
  return arr.every((item) => typeof item === "number");
}
