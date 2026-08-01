"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ImageOff, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api, buildQuery } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GearSummary } from "@/types";

const MIN_CHARS = 4;
const MAX_SUGGESTIONS = 6;

function highlight(text: string, term: string) {
  const index = text.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1 || !term) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-accent text-accent-foreground">
        {text.slice(index, index + term.length)}
      </mark>
      {text.slice(index + term.length)}
    </>
  );
}

export function GearSearch({
  className,
  onNavigate,
  autoFocus,
}: {
  className?: string;
  onNavigate?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);

  const debounced = useDebouncedValue(term.trim(), 300);
  const ready = debounced.length >= MIN_CHARS;

  const { data, isFetching } = useQuery({
    queryKey: queryKeys.gear.list({ search: debounced, limit: MAX_SUGGESTIONS }),
    queryFn: async () => {
      const { data } = await api.get<GearSummary[]>(
        `/gear${buildQuery({ search: debounced, limit: MAX_SUGGESTIONS })}`
      );
      return data;
    },
    enabled: ready,
    staleTime: 30 * 1000,
  });

  const suggestions = ready ? (data ?? []) : [];

  const [lastTerm, setLastTerm] = useState(debounced);
  if (lastTerm !== debounced) {
    setLastTerm(debounced);
    setCursor(-1);
  }

  useEffect(() => {
    function onClickAway(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  function goToResults() {
    const query = term.trim();
    setOpen(false);
    onNavigate?.();
    router.push(query ? `/gear?search=${encodeURIComponent(query)}` : "/gear");
  }

  function goToGear(id: string) {
    setOpen(false);
    setTerm("");
    onNavigate?.();
    router.push(`/gear/${id}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setCursor((current) => {
        const next = current + step;
        if (next < 0) return suggestions.length - 1;
        if (next >= suggestions.length) return 0;
        return next;
      });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (cursor >= 0 && suggestions[cursor]) {
        goToGear(suggestions[cursor].id);
      } else {
        goToResults();
      }
    }
  }

  const showPanel = open && term.trim().length > 0;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          goToResults();
        }}
        role="search"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            autoFocus={autoFocus}
            onChange={(event) => {
              setTerm(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search gear..."
            aria-label="Search gear"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
            className="h-9 pr-9 pl-9"
          />
          {isFetching ? (
            <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          ) : term ? (
            <button
              type="button"
              onClick={() => {
                setTerm("");
                setOpen(false);
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </form>

      {showPanel ? (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border bg-popover shadow-lg">
          {!ready ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Keep typing &mdash; {MIN_CHARS - term.trim().length} more character
              {MIN_CHARS - term.trim().length === 1 ? "" : "s"} to search
            </p>
          ) : isFetching && suggestions.length === 0 ? (
            <p className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Searching...
            </p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No gear found for &ldquo;{debounced}&rdquo;
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Gear suggestions">
              {suggestions.map((item, index) => (
                <li key={item.id} role="option" aria-selected={index === cursor}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(index)}
                    onClick={() => goToGear(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      index === cursor ? "bg-accent" : "hover:bg-accent/60"
                    )}
                  >
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.images?.[0] ? (
                        <Image
                          src={item.images[0]}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="grid size-full place-items-center text-muted-foreground">
                          <ImageOff className="size-4" />
                        </span>
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {highlight(item.name, debounced)}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.brand}
                        {item.category ? ` · ${item.category.name}` : ""}
                      </span>
                    </span>

                    <span className="shrink-0 text-sm font-semibold">
                      {formatCurrency(item.pricePerDay)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {ready && suggestions.length > 0 ? (
            <button
              type="button"
              onClick={goToResults}
              className="flex w-full items-center justify-center gap-1.5 border-t bg-muted/40 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              Show all results for &ldquo;{debounced}&rdquo;
              <ArrowRight className="size-3.5" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
