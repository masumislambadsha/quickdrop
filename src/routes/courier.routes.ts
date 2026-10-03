import { Banknote, ClipboardList, User } from "lucide-react";
import type { DashboardLink } from "./index";

export const courierRoutes: DashboardLink[] = [
  { label: "My Tasks", href: "/courier", icon: ClipboardList },
  { label: "Earnings", href: "/courier/earnings", icon: Banknote },
  { label: "Profile", href: "/courier/profile", icon: User },
];
