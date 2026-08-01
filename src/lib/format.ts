import { differenceInCalendarDays, format, parseISO } from "date-fns";

export function formatCurrency(value: string | number) {
  const amount = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd MMM yyyy");
}

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd MMM yyyy, h:mm a");
}

export function rentalDays(start: string | Date, end: string | Date) {
  const from = typeof start === "string" ? parseISO(start) : start;
  const to = typeof end === "string" ? parseISO(end) : end;
  return Math.max(1, differenceInCalendarDays(to, from));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
