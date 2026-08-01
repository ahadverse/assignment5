import { Boxes } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "My Gear" };

export default function ProviderGearPage() {
  return (
    <>
      <PageHeader title="My Gear" description="Manage the equipment you rent out." />
      <EmptyState
        icon={Boxes}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
