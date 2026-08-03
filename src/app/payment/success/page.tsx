import { Suspense } from "react";
import { PaymentConfirmation } from "@/components/payment/payment-confirmation";
import { PaymentPending } from "@/components/payment/payment-pending";

export const metadata = { title: "Payment successful" };

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentPending label="Confirming your payment" />}>
      <PaymentConfirmation />
    </Suspense>
  );
}
