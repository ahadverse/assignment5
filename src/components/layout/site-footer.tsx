import Link from "next/link";
import { Mountain } from "lucide-react";

const columns = [
  {
    heading: "Browse",
    links: [
      { href: "/gear", label: "All gear" },
      { href: "/gear?category=Cycling", label: "Cycling" },
      { href: "/gear?category=Camping", label: "Camping" },
      { href: "/gear?category=Water%20Sports", label: "Water sports" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/auth/login", label: "Sign in" },
      { href: "/auth/register", label: "Create account" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 sm:col-span-2 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mountain className="size-5 text-primary" />
            GearUp
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            Rent sports and outdoor equipment from trusted local providers. Pick
            your dates, pay securely, and collect your gear.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.heading} className="space-y-3">
            <p className="text-sm font-semibold">{column.heading}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} GearUp. Built for Programming Hero
          Assignment 5.
        </p>
      </div>
    </footer>
  );
}
