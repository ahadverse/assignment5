import { ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "My Rentals" };

export default function CustomerOrdersPage() {
  return (
    <>
      <PageHeader title="My Rentals" description="Every booking you have placed and its current status." />
      <EmptyState
        icon={ShoppingBag}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
