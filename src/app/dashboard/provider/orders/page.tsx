import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Orders" };

export default function ProviderOrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Incoming rental requests to confirm and fulfil." />
      <EmptyState
        icon={ClipboardList}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
