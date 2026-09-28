import type { Metadata } from "next";
import { ShipmentWizard } from "@/components/form/shipment-wizard";

export const metadata: Metadata = {
  title: "New shipment",
  description:
    "Book a new shipment in three steps — sender and recipient, parcel details, review and pay.",
};

export default function NewShipmentPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ShipmentWizard />
    </div>
  );
}
