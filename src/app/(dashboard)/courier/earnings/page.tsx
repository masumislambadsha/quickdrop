import type { Metadata } from "next";
import { CourierEarnings } from "@/components/modules/courier/earnings";

export const metadata: Metadata = {
  title: "Earnings",
  description: "Courier earnings — completed deliveries and workload summary.",
};

export default function CourierEarningsPage() {
  return <CourierEarnings />;
}
