"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ROLE_OPTIONS } from "@/components/modules/shipments/status-options";
import {
  DataTableBody,
  DataTableFooter,
  DataTableHeader,
  DataTableRow,
  DataTableRows,
  DataTableShell,
} from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllUsersInfinite,
  useChangeUserRole,
  useChangeUserStatus,
  useDebounce,
  useListParams,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import type { ManagedUser, UserRole } from "@/types";

const ROLE_DIALOG_OPTIONS = [
  { value: "CUSTOMER", label: "Customer" },
  { value: "COURIER", label: "Courier" },
  { value: "ADMIN", label: "Admin" },
];

const USERS_GRID = "sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]";

export function AdminUsers() {
  const { params, setParams } = useListParams();
  const debouncedSearch = useDebounce(params.search, 500);
  const roleFilter = (params.status as UserRole) || undefined;
  const history = useAllUsersInfinite({
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(roleFilter ? { role: roleFilter } : {}),
  });
  const { refetch } = history;
  const roleMutation = useChangeUserRole();
  const statusMutation = useChangeUserStatus();

  const items = history.data?.pages.flatMap((p) => p.data) ?? [];
  const total = history.data?.pages[0]?.meta?.total ?? 0;

  const [roleTarget, setRoleTarget] = useState<ManagedUser | null>(null);
  const [roleValue, setRoleValue] = useState<UserRole>("CUSTOMER");
  const [statusTarget, setStatusTarget] = useState<ManagedUser | null>(null);

  const openRole = (u: ManagedUser) => {
    setRoleValue(u.role);
    setRoleTarget(u);
  };

  const confirmRole = async () => {
    if (!roleTarget) return;
    try {
      await roleMutation.mutateAsync({
        userId: roleTarget.id,
        role: roleValue,
      });
      toast.success(`${roleTarget.name} is now ${roleValue.toLowerCase()}.`);
      setRoleTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const confirmStatus = async () => {
    if (!statusTarget) return;
    const next = statusTarget.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    try {
      await statusMutation.mutateAsync({
        userId: statusTarget.id,
        status: next,
      });
      toast.success(
        `${statusTarget.name} ${next === "BLOCKED" ? "blocked" : "activated"}.`,
      );
      setStatusTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="grid w-full min-w-0 gap-4">
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
        <Select
          label="Filter by role"
          value={params.status}
          onChange={(v) => setParams({ status: v }, { resetPage: true })}
          options={ROLE_OPTIONS}
        />
      </div>

      {history.isPending ? (
        <div className="grid gap-2">
          {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      ) : history.isError ? (
        <p className="text-sm text-destructive">
          {getErrorMessage(history.error)}
        </p>
      ) : items.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <DataTableShell>
            <DataTableHeader
              gridClass={USERS_GRID}
              columns={[
                { label: "User" },
                { label: "Role", className: "sm:justify-self-end" },
                { label: "Status", className: "sm:justify-self-end" },
                { label: "Actions", className: "sm:justify-self-end" },
              ]}
            />
            <DataTableBody>
              <DataTableRows>
                {items.map((u) => (
                  <DataTableRow key={u.id} gridClass={USERS_GRID}>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-medium text-slate-900">
                        {u.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {u.email}
                      </p>
                    </div>
                    <div className="min-w-0 shrink-0 sm:justify-self-end">
                      <span className="inline-flex items-center rounded-full bg-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-600">
                        {u.role}
                      </span>
                    </div>
                    <div className="min-w-0 shrink-0 sm:justify-self-end">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em]",
                          u.status === "ACTIVE"
                            ? "bg-lime text-ink"
                            : "bg-[#d64545] text-white",
                        )}
                      >
                        {u.status}
                      </span>
                    </div>
                    <div className="flex min-w-0 gap-2 sm:justify-self-end">
                      <button
                        type="button"
                        onClick={() => openRole(u)}
                        className="cursor-pointer rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-slate-500"
                      >
                        Role
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusTarget(u)}
                        className="cursor-pointer rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-[#d64545] hover:text-[#d64545]"
                      >
                        {u.status === "BLOCKED" ? "Activate" : "Block"}
                      </button>
                    </div>
                  </DataTableRow>
                ))}
              </DataTableRows>
              {history.isFetchingNextPage ? (
                <div className="grid min-w-0 gap-2 pt-2">
                  {["more-1", "more-2"].map((k) => (
                    <Skeleton
                      key={k}
                      className="h-[68px] w-full rounded-[14px]"
                    />
                  ))}
                </div>
              ) : null}
            </DataTableBody>
          </DataTableShell>
          <DataTableFooter
            shown={items.length}
            total={total}
            hasNextPage={history.hasNextPage}
            isLoading={history.isFetchingNextPage}
            onLoadMore={() => history.fetchNextPage()}
          />
        </>
      )}

      <Dialog
        open={roleTarget !== null}
        onOpenChange={(o) => !o && setRoleTarget(null)}
        title="Change role"
        description={
          roleTarget
            ? `Pick a new role for ${roleTarget.name} (${roleTarget.email}).`
            : undefined
        }
      >
        <div className="grid gap-4">
          <Select
            label="Role"
            value={roleValue}
            onChange={(v) => setRoleValue(v as UserRole)}
            options={ROLE_DIALOG_OPTIONS}
            className="w-full justify-between"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRoleTarget(null)}
              className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmRole}
              disabled={roleMutation.isPending}
              className="btn-lime !py-2.5 !text-sm disabled:opacity-50"
            >
              {roleMutation.isPending ? "Saving..." : "Save role"}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={statusTarget !== null}
        onOpenChange={(o) => !o && setStatusTarget(null)}
        title={
          statusTarget?.status === "BLOCKED" ? "Activate user" : "Block user"
        }
        description={
          statusTarget
            ? statusTarget.status === "BLOCKED"
              ? `${statusTarget.name} will be able to log in again.`
              : `${statusTarget.name} will be locked out immediately.`
            : undefined
        }
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setStatusTarget(null)}
            className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmStatus}
            disabled={statusMutation.isPending}
            className="rounded-full bg-[#d64545] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
          >
            {statusMutation.isPending
              ? "Working..."
              : statusTarget?.status === "BLOCKED"
                ? "Activate"
                : "Block"}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
