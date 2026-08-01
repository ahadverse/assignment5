import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Package, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GearGallery } from "@/components/gear/gear-gallery";
import { GearReviews } from "@/components/gear/gear-reviews";
import { RentNowPanel } from "@/components/gear/rent-now-panel";
import { RatingStars } from "@/components/shared/rating-stars";
import { serverFetch } from "@/lib/server-api";
import { getCurrentUser } from "@/lib/auth-server";
import { ApiError } from "@/lib/api-error";
import type { GearDetail } from "@/types";

async function loadGear(id: string) {
  try {
    const { data } = await serverFetch<GearDetail>(`/gear/${id}`);
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data } = await serverFetch<GearDetail>(`/gear/${id}`);
    return {
      title: data.name,
      description: data.description.slice(0, 155),
    };
  } catch {
    return { title: "Gear" };
  }
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [gear, user] = await Promise.all([loadGear(id), getCurrentUser()]);

  const reviews = gear.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const specs = Object.entries(gear.specifications ?? {});
  const inStock = gear.availability && gear.stock > 0;

  return (
    <div className="container-page py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/gear" className="hover:text-foreground">
          Gear
        </Link>
        {gear.category ? (
          <>
            <ChevronRight className="size-3.5" />
            <Link
              href={`/gear?category=${encodeURIComponent(gear.category.name)}`}
              className="hover:text-foreground"
            >
              {gear.category.name}
            </Link>
          </>
        ) : null}
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{gear.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <GearGallery images={gear.images ?? []} name={gear.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {gear.category ? (
              <Badge variant="secondary">{gear.category.name}</Badge>
            ) : null}
            <Badge variant="outline">{gear.condition} condition</Badge>
            {inStock ? (
              <Badge variant="outline" className="border-primary/40 text-primary">
                {gear.stock} available
              </Badge>
            ) : (
              <Badge variant="outline" className="border-destructive/40 text-destructive">
                Out of stock
              </Badge>
            )}
          </div>

          <p className="mt-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {gear.brand}
          </p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{gear.name}</h1>

          {reviews.length > 0 ? (
            <div className="mt-3 flex items-center gap-2">
              <RatingStars rating={averageRating} size="size-4" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} &middot; {reviews.length} review
                {reviews.length === 1 ? "" : "s"}
              </span>
            </div>
          ) : null}

          <p className="mt-5 text-muted-foreground">{gear.description}</p>

          <div className="mt-6">
            <RentNowPanel gear={gear} user={user} />
          </div>

          {gear.provider ? (
            <div className="mt-6 flex items-center gap-3 rounded-xl border p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Store className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Provided by</p>
                <p className="truncate font-medium">{gear.provider.fullName}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {specs.length > 0 ? (
        <section className="mt-14">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Package className="size-5" />
            Specifications
          </h2>
          <Separator className="mt-4" />
          <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-4 border-b py-3 text-sm"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="text-xl font-semibold">
          Reviews{" "}
          <span className="text-muted-foreground">({reviews.length})</span>
        </h2>
        <Separator className="mt-4 mb-6" />
        <GearReviews reviews={reviews} />
      </section>
    </div>
  );
}
