import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { MyShipmentsList } from "@/components/modules/customer/shipments-list";

export const metadata: Metadata = {
  title: "My shipments",
  description: "Browse, search, and filter your shipments.",
};

export default function MyShipmentsPage() {
  return (
    <Suspense fallback={<AuthLoading label="Loading shipments..." />}>
      <MyShipmentsList />
    </Suspense>
  );
}
