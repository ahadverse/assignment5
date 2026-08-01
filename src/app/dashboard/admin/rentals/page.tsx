import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Rentals" };

export default function AdminRentalsPage() {
  return (
    <>
      <PageHeader title="Rentals" description="Every rental order across the platform." />
      <EmptyState
        icon={ClipboardList}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
