import { PageHeader } from "@/components/dashboard/page-header";
import { CategoryList } from "@/components/admin/category-list";

export const metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage the categories providers can list under."
      />
      <CategoryList />
    </>
  );
}
