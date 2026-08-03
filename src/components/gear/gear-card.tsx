import Image from "next/image";
import Link from "next/link";
import { ImageOff, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { GearSummary } from "@/types";

export function GearCard({ gear }: { gear: GearSummary }) {
  const cover = gear.images?.[0];
  const soldOut = !gear.availability || gear.stock < 1;

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={gear.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <ImageOff className="size-8" />
          </div>
        )}

        {gear.category ? (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-background/90 backdrop-blur"
          >
            {gear.category.name}
          </Badge>
        ) : null}

        <Badge
          variant="outline"
          className={
            soldOut
              ? "absolute top-3 right-3 border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300"
              : "absolute top-3 right-3 border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300"
          }
        >
          {soldOut ? "Unavailable" : "Available"}
        </Badge>

        {soldOut ? (
          <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-[1px]">
            <Badge variant="outline" className="bg-background">
              Currently unavailable
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {gear.brand}
        </p>
        <h3 className="line-clamp-1 font-semibold group-hover:text-primary">
          {gear.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {gear.description}
        </p>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-lg font-semibold">
            {formatCurrency(gear.pricePerDay)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / day
            </span>
          </p>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {gear.condition.toLowerCase()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function GearCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="aspect-4/3 animate-pulse bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
