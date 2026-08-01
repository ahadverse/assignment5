import type { Role } from "@/types";

export interface NavItem {
  href: string;
  label: string;
}

export const dashboardNav: Record<Role, NavItem[]> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview" },
    { href: "/dashboard/customer/orders", label: "My Rentals" },
    { href: "/dashboard/customer/payments", label: "Payments" },
    { href: "/dashboard/customer/reviews", label: "Reviews" },
    { href: "/dashboard/customer/profile", label: "Profile" },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview" },
    { href: "/dashboard/provider/gear", label: "My Gear" },
    { href: "/dashboard/provider/orders", label: "Orders" },
    { href: "/dashboard/provider/profile", label: "Profile" },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/users", label: "Users" },
    { href: "/dashboard/admin/gear", label: "Gear" },
    { href: "/dashboard/admin/rentals", label: "Rentals" },
    { href: "/dashboard/admin/categories", label: "Categories" },
    { href: "/dashboard/admin/profile", label: "Profile" },
  ],
};

export const roleLabels: Record<Role, string> = {
  CUSTOMER: "Customer",
  PROVIDER: "Provider",
  ADMIN: "Admin",
};

export function dashboardHome(role: Role) {
  return dashboardNav[role][0].href;
}
