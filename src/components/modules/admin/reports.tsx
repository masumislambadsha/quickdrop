"use client";

import { PaginationControls } from "@/components/modules/shipments/shipment-table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuditLogs, useListParams } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

export function AdminReports() {
  const { params, setParams } = useListParams();
  const { data, isPending, isError, error } = useAuditLogs({
    page: params.page,
    limit: 15,
  });

  return (
    <div className="grid gap-4">
      {isPending ? (
        <div className="grid gap-2">
          {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"]
            .slice(0, 8)
            .map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
      ) : (data.data ?? []).length === 0 ? (
        <EmptyState
          title="No audit logs"
          description="Critical actions will be recorded here."
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Actor role</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data.data ?? []).map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="secondary">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.resourceType}
                    {log.resourceId ? ` · ${log.resourceId.slice(0, 8)}` : ""}
                  </TableCell>
                  <TableCell>{log.actorRole}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
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
