import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatISODateToCustomFormat(isoDate: string): string {
  const date = new Date(isoDate);

  const day = date.getUTCDate();
  const monthIndex = date.getUTCMonth();
  const year = date.getUTCFullYear();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthName = monthNames[monthIndex];

  const shortYear = year.toString().slice(-2);

  const getOrdinalSuffix = (day: number): string => {
    if (day > 10 && day < 20) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const ordinalSuffix = getOrdinalSuffix(day);

  const formattedDate = `${day}${ordinalSuffix}, ${monthName}'${shortYear}`;

  return formattedDate;
}

export function capitalizeFirstLetter(input: string): string {
  if (!input) return ""; // Handle empty string or undefined
  return input.charAt(0).toUpperCase() + input.slice(1);
}