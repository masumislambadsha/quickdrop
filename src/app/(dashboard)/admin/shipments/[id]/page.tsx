import type { Metadata } from "next";
import { AdminShipmentDetail } from "@/components/modules/admin/shipment-detail";

export const metadata: Metadata = {
  title: "Shipment details",
  description: "Inspect a shipment, assign a courier, or update its status.",
};

export default async function AdminShipmentDetailPage({
  params,
}: PageProps<"/admin/shipments/[id]">) {
  const { id } = await params;
  return <AdminShipmentDetail id={id} />;
}
