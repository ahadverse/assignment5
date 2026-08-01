import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="size-7" />
        </span>
        <p className="mt-6 text-sm font-semibold tracking-wide text-primary uppercase">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          We could not find that page
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          The gear you are looking for may have been removed, or the link might
          be out of date.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/gear">Browse gear</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
