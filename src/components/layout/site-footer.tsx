import Link from "next/link";
import { Mountain } from "lucide-react";
import { dashboardHome } from "@/lib/navigation";
import type { User } from "@/types";

const browseColumn = {
  heading: "Browse",
  links: [
    { href: "/gear", label: "All gear" },
    { href: "/gear?category=Cycling", label: "Cycling" },
    { href: "/gear?category=Camping", label: "Camping" },
    { href: "/gear?category=Fitness", label: "Fitness" },
    { href: "/gear?category=Water%20Sports", label: "Water sports" },
  ],
};

const providerColumn = {
  heading: "For providers",
  links: [
    { href: "/auth/register", label: "List your gear" },
    { href: "/dashboard/provider", label: "Provider dashboard" },
    { href: "/dashboard/provider/orders", label: "Manage orders" },
  ],
};

function accountColumn(user: User | null) {
  return {
    heading: "Account",
    links: user
      ? [
          { href: dashboardHome(user.role), label: "My dashboard" },
          { href: `${dashboardHome(user.role)}/profile`, label: "Profile" },
        ]
      : [
          { href: "/auth/login", label: "Sign in" },
          { href: "/auth/register", label: "Create account" },
        ],
  };
}

export function SiteFooter({ user = null }: { user?: User | null }) {
  const columns = [browseColumn, providerColumn, accountColumn(user)];

  return (
    <footer className="border-t bg-card">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          
            GearUp
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            Rent sports and outdoor equipment from trusted local providers.
            Choose your dates, pay securely, and collect your gear.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.heading} className="space-y-3">
            <p className="text-sm font-semibold">{column.heading}</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {column.links.map((link) => (
                <li key={`${column.heading}-${link.href}`}>
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
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} GearUp. All rights reserved.</p>
          <p>Built for Programming Hero Assignment 5.</p>
        </div>
      </div>
    </footer>
  );
}
