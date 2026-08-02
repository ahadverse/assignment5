import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { OrderList } from "@/components/provider/order-list";

export const metadata = { title: "Orders" };

export default function ProviderOrdersPage() {
  return (
    <>
      <PageHeader
        title="Orders"
        description="Incoming rental requests to confirm and fulfil."
      />
      <Suspense fallback={<TableSkeleton rows={5} columns={6} />}>
        <OrderList />
      </Suspense>
    </>
  );
}
