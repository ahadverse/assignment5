import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { RentalList } from "@/components/customer/rental-list";

export const metadata = { title: "My Rentals" };

export default function CustomerOrdersPage() {
  return (
    <>
      <PageHeader
        title="My Rentals"
        description="Every booking you have placed and its current status."
      />
      <Suspense fallback={<TableSkeleton rows={5} columns={5} />}>
        <RentalList />
      </Suspense>
    </>
  );
}
