import {
  Bike,
  Building2,
  FileBox,
  Snowflake,
  TriangleAlert,
  Weight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "QuickDrop services — documents, parcels, fragile, perishable, and heavy freight with tiered delivery speeds.",
};

const services = [
  {
    icon: FileBox,
    title: "Documents",
    text: "Lightweight envelopes and paperwork at the lowest rate multiplier.",
  },
  {
    icon: Bike,
    title: "Parcels",
    text: "Everyday packages with standard door-to-door handling.",
  },
  {
    icon: TriangleAlert,
    title: "Fragile goods",
    text: "Extra-care handling for breakables, priced to cover cushioning.",
  },
  {
    icon: Snowflake,
    title: "Perishables",
    text: "Time-sensitive food and medical items, best paired with Express or Same-Day.",
  },
  {
    icon: Weight,
    title: "Heavy freight",
    text: "Bulky items with weight-based pricing and vehicle-matched couriers.",
  },
  {
    icon: Building2,
    title: "Business shipping",
    text: "High-volume lanes with full tracking history and payment records.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Services</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Five package categories, three speed tiers. Every booking gets a
        tracking number, a milestone timeline, and a Stripe-secured payment.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <s.icon className="h-8 w-8 text-primary" />
            <h2 className="mt-3 font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
