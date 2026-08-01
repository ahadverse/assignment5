import { PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Add Gear" };

export default function ProviderGearNewPage() {
  return (
    <>
      <PageHeader title="Add Gear" description="List a new piece of equipment." />
      <EmptyState
        icon={PackagePlus}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
