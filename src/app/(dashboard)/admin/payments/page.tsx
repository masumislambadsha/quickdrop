import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { AdminPayments } from "@/components/modules/admin/payments";

export const metadata: Metadata = {
  title: "All payments",
  description: "Platform-wide Stripe payment records.",
};

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<AuthLoading label="Loading payments..." />}>
      <AdminPayments />
    </Suspense>
  );
}
