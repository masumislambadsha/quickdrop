import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { AdminShipments } from "@/components/modules/admin/shipments";

export const metadata: Metadata = {
  title: "Manage shipments",
  description:
    "Admin shipment management — filter, inspect, and update any shipment.",
};

export default function AdminShipmentsPage() {
  return (
    <Suspense fallback={<AuthLoading label="Loading shipments..." />}>
      <AdminShipments />
    </Suspense>
  );
}
