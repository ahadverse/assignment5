"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu, Mountain, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { useLogout } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { roleLabels } from "@/lib/navigation";
import type { User } from "@/types";

export function DashboardShell({
  user: serverUser,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const storeUser = useAuthStore((state) => state.user);
  const logout = useLogout();

  const user = storeUser ?? serverUser;

  const brand = (
    <Link href="/" className="flex items-center gap-2 font-semibold">
   
      GearUp
    </Link>
  );

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b px-5">{brand}</div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <div className="rounded-lg border bg-card p-3">
            <p className="truncate text-sm font-medium">{user.fullName}</p>
            <Badge variant="secondary" className="mt-1.5 text-[11px]">
              {roleLabels[user.role]}
            </Badge>
          </div>

          <DashboardNav role={user.role} />

          <div className="mt-auto space-y-1">
            <Separator className="mb-3" />
            <Link
              href="/gear"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
            >
              <Store className="size-4" />
              Browse gear
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open dashboard menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="flex h-16 items-center border-b px-5">
                {brand}
              </SheetTitle>
              <div className="space-y-4 p-4">
                <div className="rounded-lg border bg-card p-3">
                  <p className="truncate text-sm font-medium">{user.fullName}</p>
                  <Badge variant="secondary" className="mt-1.5 text-[11px]">
                    {roleLabels[user.role]}
                  </Badge>
                </div>
                <DashboardNav
                  role={user.role}
                  onNavigate={() => setOpen(false)}
                />
                <Separator />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="lg:hidden">{brand}</div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
