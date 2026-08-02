import { PageHeader } from "@/components/dashboard/page-header";
import { RentalDetail } from "@/components/customer/rental-detail";

export const metadata = { title: "Booking Details" };

export default async function CustomerOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PageHeader
        title="Booking details"
        description="The full record for this rental, including payment status."
      />
      <RentalDetail orderId={id} />
    </>
  );
}
