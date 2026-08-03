import Link from "next/link";
import { Mountain, ShieldCheck, Star, Truck } from "lucide-react";

const points = [
  { icon: Star, text: "Gear from trusted local providers" },
  { icon: ShieldCheck, text: "Secure Stripe checkout" },
  { icon: Truck, text: "Track every rental from one dashboard" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-1">
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="absolute -top-24 -left-20 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-24 -bottom-32 size-96 rounded-full bg-white/5 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-2 text-lg font-semibold">
        
          GearUp
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold text-balance">
            Rent the gear. Skip the garage.
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point.text} className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15">
                  <point.icon className="size-4.5" />
                </span>
                <span className="text-sm opacity-90">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs opacity-70">
          &copy; {new Date().getFullYear()} GearUp
        </p>
      </aside>

      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-lg font-semibold lg:hidden"
          >
        
            GearUp
          </Link>

          {children}
        </div>
      </div>
    </main>
  );
}
