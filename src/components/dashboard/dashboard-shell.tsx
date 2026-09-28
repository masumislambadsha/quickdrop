"use client";

import { LogOut, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetMe, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";

export function DashboardShell({
  title,
  links,
  children,
}: {
  title: string;
  links: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data } = useGetMe();
  const { mutate: doLogout, isPending } = useLogout();
  const user = data?.data;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r bg-muted/30">
        <div className="flex items-center justify-between px-4 py-4 md:flex-col md:items-stretch md:gap-6 md:p-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </span>
            QuickDrop
          </Link>
          <nav className="flex gap-1 overflow-x-auto md:flex-col">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden md:block border-t pt-4 text-sm">
            <p className="truncate font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
            <p className="mt-1 inline-block rounded bg-secondary px-2 py-0.5 text-[11px] font-semibold">
              {user?.role}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start px-2"
              disabled={isPending}
              onClick={() => doLogout()}
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-col">
        <div className="border-b px-4 py-4 md:px-8">
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
