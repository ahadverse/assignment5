"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { CalendarDays, SlidersHorizontal, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { sortOptions } from "@/lib/gear-query";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const ANY = "any";

export function GearFilters({
  categories,
  brands,
  className,
  onApply,
}: {
  categories: Category[];
  brands: string[];
  className?: string;
  onApply?: () => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");

  const debouncedMin = useDebouncedValue(minPrice, 500);
  const debouncedMax = useDebouncedValue(maxPrice, 500);

  function apply(changes: Record<string, string | undefined>) {
    const next = new URLSearchParams(params.toString());

    Object.entries(changes).forEach(([key, value]) => {
      if (!value || value === ANY) next.delete(key);
      else next.set(key, value);
    });

    next.delete("page");

    startTransition(() => {
      const query = next.toString();
      router.replace(query ? `/gear?${query}` : "/gear", { scroll: false });
      onApply?.();
    });
  }

  useEffect(() => {
    const current = params.get("minPrice") ?? "";
    if (debouncedMin !== current) apply({ minPrice: debouncedMin });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin]);

  useEffect(() => {
    const current = params.get("maxPrice") ?? "";
    if (debouncedMax !== current) apply({ maxPrice: debouncedMax });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMax]);

  const from = params.get("availableFrom");
  const to = params.get("availableTo");
  const range: DateRange | undefined = from
    ? { from: new Date(from), to: to ? new Date(to) : undefined }
    : undefined;

  const hasFilters = [
    "search",
    "category",
    "brand",
    "minPrice",
    "maxPrice",
    "availableFrom",
    "availableTo",
    "availability",
    "sort",
  ].some((key) => params.get(key));

  return (
    <div
      className={cn(
        "space-y-6 transition-opacity duration-200",
        pending && "opacity-60",
        className
      )}
    >
      <div className="flex h-8 items-center justify-between">
        <p className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="size-4" />
          Filters
        </p>
        <Button
          variant="ghost"
          size="sm"
          tabIndex={hasFilters ? undefined : -1}
          aria-hidden={!hasFilters}
          className={cn(
            "h-8 text-muted-foreground transition-opacity duration-200",
            !hasFilters && "pointer-events-none opacity-0"
          )}
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            startTransition(() => {
              router.replace("/gear", { scroll: false });
              onApply?.();
            });
          }}
        >
          <X className="size-3.5" />
          Clear
        </Button>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="filter-category">Category</Label>
        <Select
          value={params.get("category") ?? ANY}
          onValueChange={(value) => apply({ category: value })}
        >
          <SelectTrigger id="filter-category" className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-brand">Brand</Label>
        <Select
          value={params.get("brand") ?? ANY}
          onValueChange={(value) => apply({ brand: value })}
        >
          <SelectTrigger id="filter-brand" className="w-full">
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>All brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Price per day</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price per day"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
          <span className="text-muted-foreground">&ndash;</span>
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            aria-label="Maximum price per day"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Available dates</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start font-normal"
            >
              <CalendarDays className="size-4" />
              {range?.from ? (
                range.to ? (
                  <>
                    {format(range.from, "dd MMM")} &ndash;{" "}
                    {format(range.to, "dd MMM")}
                  </>
                ) : (
                  format(range.from, "dd MMM yyyy")
                )
              ) : (
                <span className="text-muted-foreground">Any dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              numberOfMonths={1}
              defaultMonth={range?.from}
              selected={range}
              disabled={{ before: new Date() }}
              onSelect={(value) =>
                apply({
                  availableFrom: value?.from
                    ? format(value.from, "yyyy-MM-dd")
                    : undefined,
                  availableTo: value?.to
                    ? format(value.to, "yyyy-MM-dd")
                    : undefined,
                })
              }
            />
            {range?.from ? (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    apply({ availableFrom: undefined, availableTo: undefined })
                  }
                >
                  Clear dates
                </Button>
              </div>
            ) : null}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label htmlFor="filter-availability" className="cursor-pointer">
          In stock only
        </Label>
        <Switch
          id="filter-availability"
          checked={params.get("availability") === "true"}
          onCheckedChange={(checked) =>
            apply({ availability: checked ? "true" : undefined })
          }
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="filter-sort">Sort by</Label>
        <Select
          value={params.get("sort") ?? "newest"}
          onValueChange={(value) => apply({ sort: value })}
        >
          <SelectTrigger id="filter-sort" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
