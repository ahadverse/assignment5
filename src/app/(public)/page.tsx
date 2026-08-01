import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  CalendarCheck,
  Dumbbell,
  ShieldCheck,
  Star,
  Tent,
  Truck,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GearCard } from "@/components/gear/gear-card";
import { serverFetch } from "@/lib/server-api";
import type { Category, GearSummary } from "@/types";

const categoryIcons: Record<string, typeof Bike> = {
  Cycling: Bike,
  Camping: Tent,
  Fitness: Dumbbell,
  "Water Sports": Waves,
};

const steps = [
  {
    icon: CalendarCheck,
    title: "Pick your dates",
    body: "Browse gear near you and choose a rental window. The calendar blocks out dates that are already booked.",
  },
  {
    icon: ShieldCheck,
    title: "Pay securely",
    body: "The provider confirms your booking, then you pay through Stripe. Your order status updates the moment it clears.",
  },
  {
    icon: Truck,
    title: "Collect and go",
    body: "Pick the gear up from the provider, enjoy it, then return it and leave a review for the next renter.",
  },
];

async function loadHomeData() {
  try {
    const [gear, categories] = await Promise.all([
      serverFetch<GearSummary[]>("/gear?limit=4&sort=newest", {
        revalidate: 60,
      }),
      serverFetch<Category[]>("/categories", { revalidate: 300 }),
    ]);
    return { gear: gear.data, categories: categories.data, failed: false };
  } catch {
    return { gear: [], categories: [], failed: true };
  }
}

export default async function HomePage() {
  const { gear, categories, failed } = await loadHomeData();

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="absolute -top-32 -right-24 size-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge variant="secondary" className="mb-5 gap-1.5">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              Trusted by local outdoor shops
            </Badge>

            <h1 className="text-4xl font-bold text-balance sm:text-5xl xl:text-6xl">
              Rent the gear.{" "}
              <span className="text-primary">Skip the garage.</span>
            </h1>

            <p className="mt-5 max-w-lg text-lg text-pretty text-muted-foreground">
              Bikes, tents, kayaks and fitness equipment from trusted local
              providers. Choose your dates, pay securely, and collect.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/gear">
                  Browse gear
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/register">List your gear</Link>
              </Button>
            </div>

            <dl className="mt-10 flex gap-8 border-t pt-6">
              <div>
                <dt className="text-sm text-muted-foreground">Categories</dt>
                <dd className="text-2xl font-semibold">
                  {categories.length || "4"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Daily rates</dt>
                <dd className="text-2xl font-semibold">from $6</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Checkout</dt>
                <dd className="text-2xl font-semibold">Stripe</dd>
              </div>
            </dl>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {gear.slice(0, 4).map((item, index) => (
                <div
                  key={item.id}
                  className={
                    index % 2 === 0
                      ? "relative aspect-3/4 overflow-hidden rounded-2xl border bg-muted"
                      : "relative mt-8 aspect-3/4 overflow-hidden rounded-2xl border bg-muted"
                  }
                >
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes="25vw"
                      priority={index < 2}
                      className="object-cover"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="container-page py-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Shop by category</h2>
              <p className="mt-1 text-muted-foreground">
                Find exactly what your trip needs.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.name] ?? Tent;
              return (
                <Link
                  key={category.id}
                  href={`/gear?category=${encodeURIComponent(category.name)}`}
                  className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold group-hover:text-primary">
                    {category.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {category.description ?? "Browse available gear"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="border-y bg-muted/40">
        <div className="container-page py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Recently added</h2>
              <p className="mt-1 text-muted-foreground">
                Fresh listings from providers on GearUp.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/gear">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {failed ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="font-medium">Gear could not be loaded right now.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The catalogue is temporarily unavailable. Please try again.
              </p>
            </div>
          ) : gear.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="font-medium">No gear listed yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Providers are still setting up their inventory.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {gear.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center text-2xl font-semibold">How GearUp works</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
          Three steps from browsing to the trailhead.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative rounded-xl border bg-card p-6">
              <span className="absolute top-6 right-6 text-4xl font-bold text-muted/60">
                {index + 1}
              </span>
              <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <div className="absolute -top-20 -left-16 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-semibold text-balance">
              Have gear sitting idle?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty opacity-90">
              List it on GearUp, set your daily rate, and manage bookings from
              one dashboard.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-7">
              <Link href="/auth/register">
                Become a provider
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
