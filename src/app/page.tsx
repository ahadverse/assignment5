import Link from "next/link";
import { ArrowRight, CalendarCheck, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const highlights = [
  {
    icon: CalendarCheck,
    title: "Book by the day",
    description:
      "Pick your rental window with a calendar that already knows what is booked.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description:
      "Pay through Stripe. Your order status updates the moment payment clears.",
  },
  {
    icon: Truck,
    title: "Collect locally",
    description:
      "Providers confirm your booking and hand the gear over when you arrive.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Rent sports and outdoor gear instantly
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">
              Bikes, tents, kayaks and fitness equipment from trusted local
              providers. Choose your dates, pay securely, and go.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/gear">
                  Browse gear
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/register">Become a provider</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-xl border bg-card p-6">
                <item.icon className="size-6 text-primary" />
                <h2 className="mt-4 font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
