import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}
