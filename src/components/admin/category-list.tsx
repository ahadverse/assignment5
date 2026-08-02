"use client";

import { Tags } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadError } from "@/components/dashboard/load-error";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { DeleteCategoryDialog } from "@/components/admin/delete-category-dialog";
import { useCategories } from "@/hooks/use-categories";

export function CategoryList() {
  const { data: categories, isPending, isError, error, refetch } = useCategories();

  if (isPending) {
    return <TableSkeleton rows={6} columns={3} />;
  }

  if (isError) {
    return (
      <LoadError
        title="We could not load categories"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CategoryFormDialog />
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories yet"
          description="Add the first category providers can list gear under."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <CategoryFormDialog category={category} />
                      <DeleteCategoryDialog category={category} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
