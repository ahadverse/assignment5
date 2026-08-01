import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Payments" };

export default function CustomerPaymentsPage() {
  return (
    <>
      <PageHeader title="Payments" description="Your payment history for completed rentals." />
      <EmptyState
        icon={CreditCard}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
