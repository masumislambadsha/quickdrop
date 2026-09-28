"use client";

import { Loader2 } from "lucide-react";
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

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

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
    { label: "Total shipments", value: s.totalShipments },
    { label: "Delivered", value: s.totalDeliveredShipments },
    { label: "Total users", value: s.totalUsers },
    { label: "Couriers", value: s.totalCouriers },
    { label: "Paid payments", value: s.totalPayments },
    { label: "Revenue", value: `$${s.totalRevenue.toFixed(2)}` },
    { label: "New users (30d)", value: s.newUsersLast30Days },
    { label: "New shipments (30d)", value: s.newShipmentsLast30Days },
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
          <Card key={c.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipments by status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shipmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users by role</CardTitle>
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
