import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { PaymentHistory } from "@/components/customer/payment-history";

export const metadata = { title: "Payments" };

export default function CustomerPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="Every checkout you have made, with its Stripe reference."
      />
      <Suspense fallback={<TableSkeleton rows={5} columns={6} />}>
        <PaymentHistory />
      </Suspense>
    </>
  );
}
