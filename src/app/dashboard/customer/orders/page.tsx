import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { RentalList } from "@/components/customer/rental-list";
import { PaymentOutcomeBanner } from "@/components/customer/payment-outcome-banner";

export const metadata = { title: "My Rentals" };

export default function CustomerOrdersPage() {
  return (
    <>
      <PageHeader
        title="My Rentals"
        description="Every booking you have placed and its current status."
      />
      <Suspense fallback={<TableSkeleton rows={5} columns={5} />}>
        <PaymentOutcomeBanner />
        <RentalList />
      </Suspense>
    </>
  );
}
