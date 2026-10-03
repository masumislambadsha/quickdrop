import { CircleX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment cancelled",
  description: "Your Stripe payment was cancelled. No charge was made.",
};

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-10 text-center sm:py-16">
      <CircleX className="h-12 w-12 text-destructive" />
      <h1 className="mt-4 text-2xl font-bold">Payment cancelled</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No charge was made. Your shipment is still booked — you can pay later
        from the shipment details page.
      </p>
      <Link
        href="/dashboard/shipments"
        className="mt-6 text-sm font-medium text-primary hover:underline"
      >
        Back to my shipments
      </Link>
    </div>
  );
}
