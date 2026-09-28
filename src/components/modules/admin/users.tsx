"use client";

import { toast } from "sonner";
import { PaginationControls } from "@/components/modules/shipments/shipment-table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAllUsers,
  useChangeUserRole,
  useChangeUserStatus,
  useDebounce,
  useListParams,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { UserRole } from "@/types";

export function AdminUsers() {
  const { params, setParams } = useListParams();
  const debouncedSearch = useDebounce(params.search, 500);
  const query = {
    page: params.page,
    limit: 10,
    search: debouncedSearch || undefined,
    role: (params.status as UserRole) || undefined,
  };
  const { data, isPending, isError, error, refetch } = useAllUsers(query);
  const roleMutation = useChangeUserRole();
  const statusMutation = useChangeUserStatus();

  const onRole = async (userId: string, current: UserRole) => {
    const next = prompt(
      `Change role (current: ${current}). Enter CUSTOMER, COURIER, or ADMIN:`,
    );
    if (!next) return;
    const role = next.toUpperCase() as UserRole;
    if (!["CUSTOMER", "COURIER", "ADMIN"].includes(role)) {
      toast.error("Invalid role.");
      return;
    }
    try {
      await roleMutation.mutateAsync({ userId, role });
      toast.success("Role updated.");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onStatus = async (userId: string, current: string) => {
    const next = current === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    if (!confirm(`${next === "BLOCKED" ? "Block" : "Activate"} this user?`))
      return;
    try {
      await statusMutation.mutateAsync({ userId, status: next });
      toast.success(`User ${next === "BLOCKED" ? "blocked" : "activated"}.`);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Search name or email..."
          value={params.search}
          onChange={(e) =>
            setParams({ search: e.target.value }, { resetPage: true })
          }
          className="sm:max-w-xs"
          aria-label="Search users"
        />
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={params.status}
          onChange={(e) =>
            setParams({ status: e.target.value }, { resetPage: true })
          }
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="COURIER">Courier</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {isPending ? (
        <div className="grid gap-2">
          {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"]
            .slice(0, 5)
            .map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      ) : (data.data ?? []).length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data.data ?? []).map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.status === "ACTIVE" ? "success" : "destructive"
                      }
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onRole(u.id, u.role)}
                        className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent cursor-pointer"
                      >
                        Role
                      </button>
                      <button
                        type="button"
                        onClick={() => onStatus(u.id, u.status)}
                        className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent cursor-pointer"
                      >
                        {u.status === "BLOCKED" ? "Activate" : "Block"}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationControls
            meta={data.meta}
            onPage={(page) => setParams({ page })}
          />
        </>
      )}
    </div>
  );
}
