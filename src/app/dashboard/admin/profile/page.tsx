import { UserRound } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Profile" };

export default function AdminProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Update your contact details." />
      <EmptyState
        icon={UserRound}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
