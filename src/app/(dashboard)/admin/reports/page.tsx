import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { AdminReports } from "@/components/modules/admin/reports";

export const metadata: Metadata = {
  title: "Reports & audit logs",
  description: "Audit trail of critical platform actions.",
};

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<AuthLoading label="Loading reports..." />}>
      <AdminReports />
    </Suspense>
  );
}
