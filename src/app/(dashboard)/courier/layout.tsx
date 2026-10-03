"use client";

import RoleGuard from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { courierRoutes } from "@/routes";

export default function CourierLayout({ children }: LayoutProps<"/courier">) {
  return (
    <RoleGuard roles={["COURIER"]}>
      <DashboardShell title="Courier workspace" links={courierRoutes}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
