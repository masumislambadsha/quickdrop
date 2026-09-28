import type { Metadata } from "next";
import { CustomerOverview } from "@/components/modules/customer/overview";

export const metadata: Metadata = {
  title: "My dashboard",
  description:
    "Customer overview — shipment stats, recent activity, and quick actions.",
};

export default function CustomerDashboardPage() {
  return <CustomerOverview />;
}
