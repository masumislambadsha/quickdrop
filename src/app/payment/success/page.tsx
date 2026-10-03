import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PaymentResult } from "@/components/modules/payment/payment-result";

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Your Stripe payment completed successfully.",
};

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 text-center sm:py-16">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Confirming payment...</p>
        }
      >
        <PaymentResult />
      </Suspense>
      <Link
        href="/dashboard/shipments"
        className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
      >
        Back to my shipments
      </Link>
    </div>
  );
}
