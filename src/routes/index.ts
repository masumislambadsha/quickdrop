import type { LucideIcon } from "lucide-react";

export interface DashboardLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export * from "./admin.routes";
export * from "./courier.routes";
export * from "./customer.routes";
