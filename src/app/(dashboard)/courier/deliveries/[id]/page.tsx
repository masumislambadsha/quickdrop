import type { Metadata } from "next";
import { DeliveryDetail } from "@/components/modules/courier/delivery-detail";

export const metadata: Metadata = {
  title: "Delivery details",
  description: "Update delivery status and confirm completed deliveries.",
};

export default async function DeliveryDetailPage({
  params,
}: PageProps<"/courier/deliveries/[id]">) {
  const { id } = await params;
  return <DeliveryDetail id={id} />;
}
