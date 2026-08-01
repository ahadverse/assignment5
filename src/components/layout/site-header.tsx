"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Menu,
  Mountain,
  Search,
  Tent,
  Bike,
  Dumbbell,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/hooks/use-auth";
import { dashboardHome, dashboardNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

const categories = [
  { name: "Cycling", icon: Bike },
  { name: "Camping", icon: Tent },
  { name: "Fitness", icon: Dumbbell },
  { name: "Water Sports", icon: Waves },
];

export function SiteHeader({ user: serverUser }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const storeUser = useAuthStore((state) => state.user);
  const logout = useLogout();

  const user = storeUser ?? serverUser;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const query = term.trim();
    router.push(query ? `/gear?search=${encodeURIComponent(query)}` : "/gear");
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-shadow duration-200",
        scrolled
          ? "border-border bg-background/80 shadow-sm backdrop-blur-lg"
          : "border-transparent bg-background"
      )}
    >
      <div className="container-page flex h-16 items-center gap-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Mountain className="size-4.5" />
          </span>
          <span className="tracking-tight">GearUp</span>
        </Link>

        <nav className="ml-2 hidden items-center lg:flex">
          <Link
            href="/"
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive("/")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none",
                  isActive("/gear")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Browse Gear
                <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/gear" className="font-medium">
                  All categories
                </Link>
              </DropdownMenuItem>
              <Separator className="my-1" />
              {categories.map((category) => (
                <DropdownMenuItem key={category.name} asChild>
                  <Link
                    href={`/gear?category=${encodeURIComponent(category.name)}`}
                  >
                    <category.icon className="size-4 text-muted-foreground" />
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <Link
              href={dashboardHome(user.role)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/dashboard")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Dashboard
            </Link>
          ) : null}
        </nav>

        <form
          onSubmit={submitSearch}
          className="ml-auto hidden max-w-xs flex-1 md:block"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search gear..."
              aria-label="Search gear"
              className="h-9 pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="shadow-sm">
                  <Link href="/auth/register">Get started</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 overflow-y-auto p-0">
              <SheetTitle className="border-b px-5 py-4 text-base">
                Menu
              </SheetTitle>

              <div className="flex flex-col gap-1 p-5">
                <form onSubmit={submitSearch} className="mb-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={term}
                      onChange={(event) => setTerm(event.target.value)}
                      placeholder="Search gear..."
                      aria-label="Search gear"
                      className="pl-9"
                    />
                  </div>
                </form>

                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Home
                </Link>
                <Link
                  href="/gear"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Browse Gear
                </Link>

                <p className="px-3 pt-4 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Categories
                </p>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/gear?category=${encodeURIComponent(category.name)}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <category.icon className="size-4" />
                    {category.name}
                  </Link>
                ))}

                {user ? (
                  <>
                    <Separator className="my-4" />
                    <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Dashboard
                    </p>
                    {dashboardNav[user.role].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                          pathname === link.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <div className="mt-6 flex flex-col gap-2">
                    <Button asChild variant="outline">
                      <Link href="/auth/login" onClick={() => setOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/register" onClick={() => setOpen(false)}>
                        Get started
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
