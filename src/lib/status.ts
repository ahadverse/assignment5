import type { PaymentStatus, RentalStatus } from "@/types";

export const rentalStatusStyles: Record<RentalStatus, string> = {
  PLACED:
    "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300",
  CONFIRMED:
    "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-300",
  PAID: "border-purple-300 bg-purple-100 text-purple-800 dark:border-purple-500/40 dark:bg-purple-500/15 dark:text-purple-300",
  PICKED_UP:
    "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300",
  RETURNED:
    "border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-500/40 dark:bg-gray-500/15 dark:text-gray-300",
  CANCELLED:
    "border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300",
};

export const rentalStatusLabels: Record<RentalStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PICKED_UP: "Picked Up",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export const rentalStatusHelp: Record<RentalStatus, string> = {
  PLACED: "Waiting for the provider to confirm this booking.",
  CONFIRMED: "Confirmed by the provider. Pay now to lock in your rental.",
  PAID: "Payment received. The provider will hand the gear over.",
  PICKED_UP: "You currently have this gear.",
  RETURNED: "Rental complete. You can leave a review.",
  CANCELLED: "This booking was cancelled.",
};

export const rentalStatuses: RentalStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
  "RETURNED",
  "CANCELLED",
];

export const paymentStatusStyles: Record<PaymentStatus, string> = {
  PENDING:
    "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300",
  COMPLETED:
    "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300",
  FAILED:
    "border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300",
};

export function nextProviderAction(status: RentalStatus) {
  if (status === "PLACED") return { label: "Confirm", next: "CONFIRMED" as const };
  if (status === "PAID") return { label: "Mark Picked Up", next: "PICKED_UP" as const };
  if (status === "PICKED_UP") return { label: "Mark Returned", next: "RETURNED" as const };
  return null;
}
