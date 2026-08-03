import { Suspense } from "react";
import { PaymentCancellation } from "@/components/payment/payment-cancellation";
import { PaymentPending } from "@/components/payment/payment-pending";

export const metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<PaymentPending label="Loading your booking" />}>
      <PaymentCancellation />
    </Suspense>
  );
}
