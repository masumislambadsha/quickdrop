import type { Metadata } from "next";
import { AdminOverview } from "@/components/modules/admin/overview";

export const metadata: Metadata = {
  title: "Admin overview",
  description: "Platform analytics — shipments, users, payments, and revenue.",
};

export default function AdminOverviewPage() {
  return <AdminOverview />;
}
