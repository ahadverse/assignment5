"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function isUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function Thumb({ url, alt }: { url: string; alt: string }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <span className="grid size-full place-items-center text-muted-foreground">
        <ImageOff className="size-5" />
      </span>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes="96px"
      className="object-cover"
      onError={() => setBroken(true)}
    />
  );
}

export function ImageUrlManager({
  value,
  onChange,
}: {
  value: string[];
  onChange: (images: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  function add() {
    const url = draft.trim();

    if (!url) return;
    if (!isUrl(url)) {
      setHint("That does not look like a valid http or https URL.");
      return;
    }
    if (value.includes(url)) {
      setHint("That image is already on the list.");
      return;
    }

    onChange([...value, url]);
    setDraft("");
    setHint(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder="https://images.example.com/tent.jpg"
          aria-label="Image URL"
          onChange={(event) => {
            setDraft(event.target.value);
            if (hint) setHint(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      {hint ? <p className="text-sm text-destructive">{hint}</p> : null}

      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {value.map((url, index) => (
            <li
              key={url}
              className="group relative size-24 overflow-hidden rounded-lg border bg-muted"
            >
              <Thumb url={url} alt={`Image ${index + 1}`} />
              {index === 0 ? (
                <span className="absolute inset-x-0 bottom-0 bg-background/85 py-0.5 text-center text-[11px] font-medium">
                  Cover
                </span>
              ) : null}
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-background/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                onClick={() => onChange(value.filter((item) => item !== url))}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No images yet. The first one you add becomes the cover.
        </p>
      )}
    </div>
  );
}
