import RoleGuard from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { customerRoutes } from "@/routes";

export default function CustomerLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <RoleGuard roles={["CUSTOMER"]}>
      <DashboardShell title="My dashboard" links={customerRoutes}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
