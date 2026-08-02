import { PageHeader } from "@/components/dashboard/page-header";
import { RentalOverview } from "@/components/customer/rental-overview";

export const metadata = { title: "Overview" };

export default function CustomerPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Your rentals, payments and reviews at a glance."
      />
      <RentalOverview />
    </>
  );
}
