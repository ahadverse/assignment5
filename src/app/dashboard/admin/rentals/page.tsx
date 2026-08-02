import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { RentalModerationList } from "@/components/admin/rental-moderation-list";

export const metadata = { title: "Rentals" };

export default function AdminRentalsPage() {
  return (
    <>
      <PageHeader
        title="Rentals"
        description="Every rental order across the platform."
      />
      <Suspense fallback={<TableSkeleton rows={6} columns={7} />}>
        <RentalModerationList />
      </Suspense>
    </>
  );
}
