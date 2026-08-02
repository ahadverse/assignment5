import { Suspense } from "react";
import Link from "next/link";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { GearInventory } from "@/components/provider/gear-inventory";

export const metadata = { title: "My Gear" };

export default function ProviderGearPage() {
  return (
    <>
      <PageHeader
        title="My Gear"
        description="Manage the equipment you rent out."
        action={
          <Button asChild>
            <Link href="/dashboard/provider/gear/new">
              <PackagePlus className="size-4" />
              Add gear
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<TableSkeleton rows={5} columns={5} />}>
        <GearInventory />
      </Suspense>
    </>
  );
}
