import { PageHeader } from "@/components/dashboard/page-header";
import { ProviderOverview } from "@/components/provider/provider-overview";

export const metadata = { title: "Overview" };

export default function ProviderPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Your inventory, active rentals and pending orders."
      />
      <ProviderOverview />
    </>
  );
}
