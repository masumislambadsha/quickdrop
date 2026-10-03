import {
  LayoutDashboard,
  Package,
  PackagePlus,
  User,
  Wallet,
} from "lucide-react";
import type { DashboardLink } from "./index";

export const customerRoutes: DashboardLink[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Shipments", href: "/dashboard/shipments", icon: Package },
  {
    label: "New Shipment",
    href: "/dashboard/shipments/new",
    icon: PackagePlus,
  },
  { label: "Payments", href: "/dashboard/payments", icon: Wallet },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];
