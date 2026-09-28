import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { AdminDeliveries } from "@/components/modules/admin/deliveries";

export const metadata: Metadata = {
  title: "Deliveries",
  description: "All assigned courier deliveries across the platform.",
};

export default function AdminDeliveriesPage() {
  return (
    <Suspense fallback={<AuthLoading label="Loading deliveries..." />}>
      <AdminDeliveries />
    </Suspense>
  );
}
