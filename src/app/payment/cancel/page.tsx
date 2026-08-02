import { Suspense } from "react";
import { PaymentCancellation } from "@/components/payment/payment-cancellation";
import { PaymentRedirectFallback } from "@/components/payment/payment-redirect-fallback";

export const metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<PaymentRedirectFallback label="Payment cancelled" />}>
      <PaymentCancellation />
    </Suspense>
  );
}
