export type PaymentOutcome = "success" | "cancelled" | "failed";

export const paymentOutcomes: PaymentOutcome[] = [
  "success",
  "cancelled",
  "failed",
];

export function isPaymentOutcome(
  value: string | null
): value is PaymentOutcome {
  return Boolean(value) && paymentOutcomes.includes(value as PaymentOutcome);
}

export function ordersHref(outcome: PaymentOutcome, orderId?: string | null) {
  const query = new URLSearchParams({ payment: outcome });
  if (orderId) query.set("orderId", orderId);
  return `/dashboard/customer/orders?${query.toString()}`;
}
