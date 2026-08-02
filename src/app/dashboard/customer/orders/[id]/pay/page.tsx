import { PageHeader } from "@/components/dashboard/page-header";
import { PaymentInitiation } from "@/components/customer/payment-initiation";

export const metadata = { title: "Checkout" };

export default async function CustomerOrderPayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Checkout"
        description="Review your booking, then pay securely through Stripe."
      />
      <PaymentInitiation orderId={id} />
    </div>
  );
}
