"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const labels = ["Poor", "Fair", "Good", "Great", "Excellent"];

export function RatingInput({
  value,
  onChange,
  invalid,
}: {
  value: number;
  onChange: (rating: number) => void;
  invalid?: boolean;
}) {
  const [preview, setPreview] = useState(0);
  const active = preview || value;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Rating"
        aria-invalid={invalid}
        onMouseLeave={() => setPreview(0)}
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
            className="rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            onMouseEnter={() => setPreview(rating)}
            onFocus={() => setPreview(rating)}
            onBlur={() => setPreview(0)}
            onClick={() => onChange(rating)}
          >
            <Star
              className={cn(
                "size-7 transition-colors",
                rating <= active
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40"
              )}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {active ? labels[active - 1] : "Tap a star"}
      </span>
    </div>
  );
}
