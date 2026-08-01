import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function pageWindow(current: number, total: number) {
  const pages: (number | "gap")[] = [];
  const push = (value: number | "gap") => pages.push(value);

  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) push(i);
    return pages;
  }

  push(1);
  if (current > 3) push("gap");

  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  for (let i = from; i <= to; i += 1) push(i);

  if (current < total - 2) push("gap");
  push(total);

  return pages;
}

export function PaginationNav({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      <Button
        asChild={page > 1}
        variant="outline"
        size="icon"
        disabled={page <= 1}
        aria-label="Previous page"
      >
        {page > 1 ? (
          <Link href={buildHref(page - 1)}>
            <ChevronLeft className="size-4" />
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" />
          </span>
        )}
      </Button>

      {pageWindow(page, totalPages).map((entry, index) =>
        entry === "gap" ? (
          <span
            key={`gap-${index}`}
            className="px-2 text-sm text-muted-foreground"
          >
            &hellip;
          </span>
        ) : (
          <Button
            key={entry}
            asChild
            variant={entry === page ? "default" : "outline"}
            size="icon"
            className={cn("tabular-nums", entry === page && "pointer-events-none")}
            aria-current={entry === page ? "page" : undefined}
          >
            <Link href={buildHref(entry)}>{entry}</Link>
          </Button>
        )
      )}

      <Button
        asChild={page < totalPages}
        variant="outline"
        size="icon"
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        {page < totalPages ? (
          <Link href={buildHref(page + 1)}>
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span>
            <ChevronRight className="size-4" />
          </span>
        )}
      </Button>
    </nav>
  );
}
