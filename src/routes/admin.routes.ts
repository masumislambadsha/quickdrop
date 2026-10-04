import {
  FileText,
  LayoutDashboard,
  Package,
  Truck,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { DashboardLink } from "./index";

export const adminRoutes: DashboardLink[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Shipments", href: "/admin/shipments", icon: Package },
  { label: "Deliveries", href: "/admin/deliveries", icon: Truck },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: Wallet },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Profile", href: "/admin/profile", icon: UserRound },
];
