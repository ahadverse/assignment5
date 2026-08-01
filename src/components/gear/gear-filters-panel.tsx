"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GearFilters } from "@/components/gear/gear-filters";
import type { Category } from "@/types";

export function GearFiltersPanel({
  categories,
  brands,
  activeCount,
}: {
  categories: Category[];
  brands: string[];
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border bg-card p-5">
          <GearFilters categories={categories} brands={brands} />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="size-4" />
              Filters
              {activeCount > 0 ? (
                <Badge className="ml-1 size-5 justify-center p-0 tabular-nums">
                  {activeCount}
                </Badge>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto p-0">
            <SheetTitle className="border-b px-5 py-4 text-base">
              Filter gear
            </SheetTitle>
            <div className="p-5">
              <GearFilters
                categories={categories}
                brands={brands}
                onApply={() => setOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
