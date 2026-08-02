import { PageHeader } from "@/components/dashboard/page-header";
import { AdminOverview } from "@/components/admin/admin-overview";

export const metadata = { title: "Overview" };

export default function AdminPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Platform health across users, gear and rentals."
      />
      <AdminOverview />
    </>
  );
}
