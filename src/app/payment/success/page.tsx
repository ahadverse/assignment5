import { Suspense } from "react";
import { PaymentConfirmation } from "@/components/payment/payment-confirmation";
import { PaymentRedirectFallback } from "@/components/payment/payment-redirect-fallback";

export const metadata = { title: "Payment" };

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentRedirectFallback label="Confirming your payment" />}>
      <PaymentConfirmation />
    </Suspense>
  );
}
