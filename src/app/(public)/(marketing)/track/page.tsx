import type { Metadata } from "next";
import { TrackResult } from "@/components/modules/tracking/track-result";
import { TrackWidget } from "@/components/modules/tracking/track-widget";

export const metadata: Metadata = {
  title: "Track your parcel",
  description:
    "Enter a QuickDrop tracking number to see live shipment status and milestone history.",
};

export default async function TrackPage({ searchParams }: PageProps<"/track">) {
  const params = await searchParams;
  const tn = typeof params.tn === "string" ? params.tn : "";
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-bold break-words sm:text-3xl">
        Track your parcel
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the tracking number from your booking confirmation. No login
        required.
      </p>
      <div className="mt-6">
        <TrackWidget />
      </div>
      <div className="mt-6">
        {tn ? <TrackResult trackingNumber={tn} /> : null}
      </div>
    </div>
  );
}
