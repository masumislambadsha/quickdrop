"use client";

import {
  Banknote,
  Bike,
  Loader2,
  Package,
  PackageCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

const COLORS = ["#7BCC00", "#FF9A3D", "#2D5C35"];

export function AdminOverview() {
  const { data, isPending, isError, error } = useDashboardStats();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading analytics...
      </div>
    );
  }
  if (isError)
    return <p className="text-sm text-destructive">{getErrorMessage(error)}</p>;

  const s = data.data;
  const statCards = [
    { label: "Total shipments", value: s.totalShipments, icon: Package },
    {
      label: "Delivered",
      value: s.totalDeliveredShipments,
      icon: PackageCheck,
    },
    { label: "Total users", value: s.totalUsers, icon: Users },
    { label: "Couriers", value: s.totalCouriers, icon: Bike },
    { label: "Paid payments", value: s.totalPayments, icon: Wallet },
    {
      label: "Revenue",
      value: `$${s.totalRevenue.toFixed(2)}`,
      icon: Banknote,
    },
    { label: "New users (30d)", value: s.newUsersLast30Days, icon: Sparkles },
    {
      label: "New shipments (30d)",
      value: s.newShipmentsLast30Days,
      icon: Package,
    },
  ];

  const shipmentData = [
    { name: "Pending", value: s.totalPendingShipments },
    { name: "In transit", value: s.totalInTransitShipments },
    { name: "Delivered", value: s.totalDeliveredShipments },
  ];
  const userData = [
    { name: "Customers", value: s.totalCustomers },
    { name: "Couriers", value: s.totalCouriers },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <Card key={c.label} className="card-float border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-bold text-ink/60">
                {c.label}
              </CardTitle>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-forest">
                <c.icon className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </CardHeader>
            <CardContent>
              <p className="display text-4xl text-ink">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-ink/10">
          <CardHeader>
            <CardTitle className="display text-xl text-ink">
              Shipments by status
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shipmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0D1B0F22" />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tick={{ fill: "#0D1B0F" }}
                />
                <YAxis fontSize={12} tick={{ fill: "#0D1B0F" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #0D1B0F22",
                  }}
                />
                <Bar dataKey="value" fill="#2D5C35" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-ink/10">
          <CardHeader>
            <CardTitle className="display text-xl text-ink">
              Users by role
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {userData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[userData.indexOf(entry) % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
