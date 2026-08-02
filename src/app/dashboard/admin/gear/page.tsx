import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { GearModerationList } from "@/components/admin/gear-moderation-list";

export const metadata = { title: "Gear" };

export default function AdminGearPage() {
  return (
    <>
      <PageHeader
        title="Gear"
        description="Every listing across all providers."
      />
      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <GearModerationList />
      </Suspense>
    </>
  );
}
