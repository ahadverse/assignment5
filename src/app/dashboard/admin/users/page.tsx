import { Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Users" description="Search, suspend and reactivate platform accounts." />
      <EmptyState
        icon={Users}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
