import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Overview" };

export default function CustomerPage() {
  return (
    <>
      <PageHeader title="Overview" description="Your rentals, payments and reviews at a glance." />
      <EmptyState
        icon={LayoutDashboard}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
