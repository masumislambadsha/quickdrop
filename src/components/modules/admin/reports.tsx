"use client";

import { Badge } from "@/components/ui/badge";
import {
  DataTableBody,
  DataTableFooter,
  DataTableHeader,
  DataTableRow,
  DataTableRows,
  DataTableShell,
} from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditLogsInfinite } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

const REPORTS_GRID = "sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto_150px]";

export function AdminReports() {
  const history = useAuditLogsInfinite();

  const items = history.data?.pages.flatMap((p) => p.data) ?? [];
  const total = history.data?.pages[0]?.meta?.total ?? 0;

  return (
    <div className="grid w-full min-w-0 gap-4">
      {history.isPending ? (
        <div className="grid gap-2">
          {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"]
            .slice(0, 8)
            .map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
        </div>
      ) : history.isError ? (
        <p className="text-sm text-destructive">
          {getErrorMessage(history.error)}
        </p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No audit logs"
          description="Critical actions will be recorded here."
        />
      ) : (
        <>
          <DataTableShell>
            <DataTableHeader
              gridClass={REPORTS_GRID}
              columns={[
                { label: "Action" },
                { label: "Resource" },
                { label: "Actor", className: "sm:justify-self-end" },
                { label: "Time", className: "sm:text-right" },
              ]}
            />
            <DataTableBody>
              <DataTableRows>
                {items.map((log) => (
                  <DataTableRow key={log.id} gridClass={REPORTS_GRID}>
                    <div className="min-w-0">
                      <Badge variant="secondary">{log.action}</Badge>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] text-slate-900">
                        {log.resourceType}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {log.resourceId
                          ? `· ${log.resourceId.slice(0, 8)}`
                          : ""}
                      </p>
                    </div>
                    <p className="min-w-0 shrink-0 text-sm font-semibold text-slate-700 sm:justify-self-end">
                      {log.actorRole}
                    </p>
                    <p className="min-w-0 truncate text-sm text-slate-600 sm:text-right">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
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
    </div>
  );
}
