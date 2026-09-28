import type { Metadata } from "next";
import { ShipmentDetail } from "@/components/modules/shipments/shipment-detail";

export const metadata: Metadata = {
  title: "Shipment details",
  description: "Shipment details, tracking timeline, and payment actions.",
};

export default async function ShipmentDetailPage({
  params,
}: PageProps<"/dashboard/shipments/[id]">) {
  const { id } = await params;
  return <ShipmentDetail id={id} backHref="/dashboard/shipments" />;
}
