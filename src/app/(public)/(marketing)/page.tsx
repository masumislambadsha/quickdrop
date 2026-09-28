import { Bike, CreditCard, PackageCheck, Radar } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PricingCalculator } from "@/components/modules/pricing/pricing-calculator";
import { TrackWidget } from "@/components/modules/tracking/track-widget";

export const metadata: Metadata = {
  title: "QuickDrop — Fast, Trackable Courier & Logistics",
  description:
    "Book shipments in minutes, track every parcel milestone, and pay securely with Stripe. Built for customers, couriers, and operations teams.",
};

const features = [
  {
    icon: PackageCheck,
    title: "Easy shipment booking",
    text: "Send documents to heavy freight with transparent, distance-and-weight pricing across Standard, Express, and Same-Day tiers.",
  },
  {
    icon: Radar,
    title: "Milestone tracking",
    text: "Every pickup, hub transfer, and delivery attempt is recorded as a timestamped tracking event you can share.",
  },
  {
    icon: Bike,
    title: "Courier network",
    text: "Operations assign verified couriers with concurrency-safe booking — no double-booking, full delivery audit trail.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    text: "Pay per shipment with Stripe Checkout. Receipts, refunds, and payment history live in your dashboard.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
        <p className="mb-4 inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Courier & Logistics Platform
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
          Ship anything. Track everything.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
          QuickDrop moves parcels from doorstep to destination with live
          milestone tracking, verified couriers, and secure Stripe payments.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Book a shipment
          </Link>
          <Link
            href="/track"
            className="rounded-md border px-6 py-3 text-sm font-semibold hover:bg-accent"
          >
            Track a parcel
          </Link>
        </div>
        <div className="mx-auto mt-10 max-w-xl">
          <TrackWidget />
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <f.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Estimate your delivery cost
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          Same pricing engine as the backend — base fare plus distance and
          weight, adjusted by tier and package type.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <PricingCalculator />
        </div>
      </section>
    </div>
  );
}
