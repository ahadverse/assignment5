import { Boxes } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Gear" };

export default function AdminGearPage() {
  return (
    <>
      <PageHeader title="Gear" description="Every listing across all providers." />
      <EmptyState
        icon={Boxes}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
