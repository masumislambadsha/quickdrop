import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { CustomerPayments } from "@/components/modules/customer/payments";

export const metadata: Metadata = {
  title: "Payments",
  description: "Your payment history and receipts.",
};

export default function CustomerPaymentsPage() {
  return (
    <Suspense fallback={<AuthLoading label="Loading payments..." />}>
      <CustomerPayments />
    </Suspense>
  );
}
