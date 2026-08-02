"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface SpecEntry {
  key: string;
  value: string;
}

export function SpecEditor({
  value,
  onChange,
}: {
  value: SpecEntry[];
  onChange: (entries: SpecEntry[]) => void;
}) {
  function update(index: number, patch: Partial<SpecEntry>) {
    onChange(
      value.map((entry, position) =>
        position === index ? { ...entry, ...patch } : entry
      )
    );
  }

  return (
    <div className="space-y-3">
      {value.length > 0 ? (
        <ul className="space-y-2">
          {value.map((entry, index) => (
            <li key={index} className="flex gap-2">
              <Input
                value={entry.key}
                placeholder="Weight"
                aria-label={`Specification ${index + 1} name`}
                onChange={(event) => update(index, { key: event.target.value })}
              />
              <Input
                value={entry.value}
                placeholder="2.4 kg"
                aria-label={`Specification ${index + 1} value`}
                onChange={(event) =>
                  update(index, { value: event.target.value })
                }
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Remove specification ${index + 1}`}
                onClick={() =>
                  onChange(value.filter((_, position) => position !== index))
                }
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No specifications yet. These show as a table on the gear page.
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { key: "", value: "" }])}
      >
        <Plus className="size-4" />
        Add specification
      </Button>
    </div>
  );
}
