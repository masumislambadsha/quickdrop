import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About QuickDrop — the courier and logistics platform for customers, couriers, and operations teams.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold md:text-4xl">About QuickDrop</h1>
      <p className="mt-4 text-muted-foreground">
        QuickDrop is a courier and logistics platform that connects customers
        who need parcels moved with verified couriers — under the supervision of
        an operations team. Every shipment flows through a strict state machine:
        requested, picked up, in transit, out for delivery, and delivered, with
        failed and cancelled paths fully audited.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold">For customers</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Book shipments in minutes, pay securely with Stripe, track every
            milestone, and review your full shipping history.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold">For couriers</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Receive assigned jobs, update delivery status from the field,
            confirm deliveries, and track your completed work.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold">For operations</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor every shipment, assign couriers without double-booking,
            verify payments, manage users, and audit critical actions.
          </p>
        </div>
      </div>
    </div>
  );
}
