import { Tags } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return (
    <>
      <PageHeader title="Categories" description="Manage the categories providers can list under." />
      <EmptyState
        icon={Tags}
        title="Nothing here yet"
        description="This section is being set up."
      />
    </>
  );
}
