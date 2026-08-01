import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Overview" };

export default function AdminPage() {
  return (
    <>
      <PageHeader title="Overview" description="Platform health across users, gear and rentals." />
      <EmptyState
        icon={LayoutDashboard}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
