export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalCouriers: number;
  totalShipments: number;
  totalDeliveredShipments: number;
  totalInTransitShipments: number;
  totalPendingShipments: number;
  totalPayments: number;
  totalRevenue: number;
  newUsersLast30Days: number;
  newShipmentsLast30Days: number;
  generatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId?: string | null;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  details?: unknown;
  createdAt: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "COURIER" | "ADMIN";
  status: string;
  createdAt: string;
}
