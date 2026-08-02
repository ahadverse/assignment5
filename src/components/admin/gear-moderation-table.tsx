import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { GearSummary } from "@/types";

function Cover({ gear }: { gear: GearSummary }) {
  const cover = gear.images?.[0];

  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
      {cover ? (
        <Image
          src={cover}
          alt={gear.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        <span className="grid size-full place-items-center text-muted-foreground">
          <ImageOff className="size-4" />
        </span>
      )}
    </div>
  );
}

function AvailabilityBadge({ gear }: { gear: GearSummary }) {
  if (!gear.availability) {
    return <Badge variant="outline">Hidden</Badge>;
  }
  if (gear.stock < 1) {
    return (
      <Badge
        variant="outline"
        className="border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300"
      >
        Out of stock
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300"
    >
      Available
    </Badge>
  );
}

export function GearModerationTable({ gear }: { gear: GearSummary[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gear</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Per day</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gear.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Cover gear={item} />
                    <div className="min-w-0">
                      <Link
                        href={`/gear/${item.id}`}
                        className="line-clamp-1 font-medium hover:text-primary hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.brand}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.provider?.fullName ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.category?.name ?? "—"}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(item.pricePerDay)}
                </TableCell>
                <TableCell>
                  <AvailabilityBadge gear={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {gear.map((item) => (
          <div key={item.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <Cover gear={item} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/gear/${item.id}`}
                  className="line-clamp-1 font-medium hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {item.provider?.fullName ?? "—"} &middot;{" "}
                  {item.category?.name ?? "—"}
                </p>
              </div>
              <AvailabilityBadge gear={item} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-semibold tabular-nums">
                {formatCurrency(item.pricePerDay)}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / day
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
