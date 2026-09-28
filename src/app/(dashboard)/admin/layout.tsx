import RoleGuard from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminRoutes } from "@/routes";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <DashboardShell title="Admin dashboard" links={adminRoutes}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
