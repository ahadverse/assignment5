import {
  Boxes,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  PackagePlus,
  ShoppingBag,
  Star,
  Tags,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const dashboardNav: Record<Role, NavItem[]> = {
  CUSTOMER: [
    {
      href: "/dashboard/customer",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    { href: "/dashboard/customer/orders", label: "My Rentals", icon: ShoppingBag },
    { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/customer/reviews", label: "Reviews", icon: Star },
    { href: "/dashboard/customer/profile", label: "Profile", icon: UserRound },
  ],
  PROVIDER: [
    {
      href: "/dashboard/provider",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    { href: "/dashboard/provider/gear", label: "My Gear", icon: Boxes },
    {
      href: "/dashboard/provider/gear/new",
      label: "Add Gear",
      icon: PackagePlus,
    },
    {
      href: "/dashboard/provider/orders",
      label: "Orders",
      icon: ClipboardList,
    },
    { href: "/dashboard/provider/profile", label: "Profile", icon: UserRound },
  ],
  ADMIN: [
    {
      href: "/dashboard/admin",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/gear", label: "Gear", icon: Boxes },
    { href: "/dashboard/admin/rentals", label: "Rentals", icon: ClipboardList },
    { href: "/dashboard/admin/categories", label: "Categories", icon: Tags },
    { href: "/dashboard/admin/profile", label: "Profile", icon: UserRound },
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

export function isNavActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}
