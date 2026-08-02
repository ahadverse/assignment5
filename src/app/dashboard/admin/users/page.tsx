import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { UserList } from "@/components/admin/user-list";

export const metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Users"
        description="Search, suspend and reactivate platform accounts."
      />
      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <UserList />
      </Suspense>
    </>
  );
}
