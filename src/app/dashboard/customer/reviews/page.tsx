import { Star } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Reviews" };

export default function CustomerReviewsPage() {
  return (
    <>
      <PageHeader title="Reviews" description="Reviews you have left after returning gear." />
      <EmptyState
        icon={Star}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
