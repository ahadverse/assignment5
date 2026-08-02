import { PageHeader } from "@/components/dashboard/page-header";
import { ReviewCenter } from "@/components/customer/review-center";

export const metadata = { title: "Reviews" };

export default function CustomerReviewsPage() {
  return (
    <>
      <PageHeader
        title="Reviews"
        description="Rate the gear you have returned and see what you have already posted."
      />
      <ReviewCenter />
    </>
  );
}
