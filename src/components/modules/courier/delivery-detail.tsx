"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useConfirmDelivery,
  useDelivery,
  useUpdateDeliveryStatus,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { DeliveryStatus } from "@/types";

const NEXT_STATUSES: DeliveryStatus[] = [
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "FAILED",
];

const confirmSchema = z.object({
  code: z.string().min(1, "Confirmation code is required"),
});

export function DeliveryDetail({ id }: { id: string }) {
  const { data, isPending, isError, error, refetch } = useDelivery(id);
  const statusMutation = useUpdateDeliveryStatus();
  const confirmMutation = useConfirmDelivery();
  const [status, setStatus] = useState<DeliveryStatus>("PICKED_UP");
  const [failedReason, setFailedReason] = useState("");

  const confirmForm = useForm<z.infer<typeof confirmSchema>>({
    resolver: zodResolver(confirmSchema) as Resolver<
      z.infer<typeof confirmSchema>
    >,
  });

  if (isPending)
    return <p className="text-sm text-muted-foreground">Loading delivery...</p>;
  if (isError)
    return (
      <p className="text-sm text-destructive">
        {getErrorMessage(error, "Delivery not found.")}
      </p>
    );

  const d = data.data;
  const terminal = ["DELIVERED", "FAILED", "RETURNED"].includes(d.status);

  const onStatus = async () => {
    try {
      await statusMutation.mutateAsync({
        id,
        status,
        failedReason: status === "FAILED" ? failedReason : undefined,
      });
      toast.success(
        `Delivery marked as ${status.replaceAll("_", " ").toLowerCase()}.`,
      );
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update status."));
    }
  };

  const onConfirm = confirmForm.handleSubmit(async (values) => {
    try {
      await confirmMutation.mutateAsync({ id, code: values.code });
      toast.success("Delivery confirmed.");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Confirmation failed."));
    }
  });

  return (
    <div className="grid gap-6">
      <div>
        <Link
          href="/courier"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to tasks
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="min-w-0 font-mono text-xl break-all sm:text-2xl font-bold">
            {d.shipment?.trackingNumber ?? d.shipmentId}
          </h2>
          <StatusBadge status={d.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job card</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="flex flex-col gap-0.5 border-b pb-2 sm:flex-row sm:justify-between sm:gap-3">
                <dt className="shrink-0 text-muted-foreground">Route</dt>
                <dd className="min-w-0 font-medium break-words sm:text-right">
                  {d.shipment?.origin} → {d.shipment?.destination}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 border-b pb-2 sm:flex-row sm:justify-between sm:gap-3">
                <dt className="shrink-0 text-muted-foreground">Recipient</dt>
                <dd className="min-w-0 font-medium break-words sm:text-right">
                  {d.shipment?.recipientName} · {d.shipment?.recipientPhone}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 border-b pb-2 sm:flex-row sm:justify-between sm:gap-3">
                <dt className="shrink-0 text-muted-foreground">Assigned</dt>
                <dd className="min-w-0 font-medium break-words sm:text-right">
                  {new Date(d.assignedAt).toLocaleString()}
                </dd>
              </div>
              {d.failedReason ? (
                <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-3">
                  <dt className="shrink-0 text-muted-foreground">
                    Failed reason
                  </dt>
                  <dd className="min-w-0 font-medium break-words sm:text-right">
                    {d.failedReason}
                  </dd>
                </div>
              ) : null}
            </dl>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {!terminal ? (
            <Card>
              <CardHeader>
                <CardTitle>Update status</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label>New status</Label>
                  <Select
                    label="New status"
                    value={status}
                    onChange={(v) => setStatus(v as DeliveryStatus)}
                    options={NEXT_STATUSES.map((s) => ({
                      value: s,
                      label: s.replaceAll("_", " "),
                    }))}
                    className="w-full justify-between"
                  />
                </div>
                {status === "FAILED" ? (
                  <div className="grid gap-1.5">
                    <Label>Failed reason</Label>
                    <Input
                      value={failedReason}
                      onChange={(e) => setFailedReason(e.target.value)}
                      placeholder="Why did delivery fail?"
                    />
                  </div>
                ) : null}
                <Button onClick={onStatus} disabled={statusMutation.isPending}>
                  {statusMutation.isPending ? "Updating..." : "Update status"}
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {d.status === "OUT_FOR_DELIVERY" ? (
            <Card>
              <CardHeader>
                <CardTitle>Confirm delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onConfirm} className="grid gap-3">
                  <div className="grid gap-1.5">
                    <Label>Confirmation code</Label>
                    <Input
                      {...confirmForm.register("code")}
                      placeholder="Code from recipient"
                    />
                    <p className="text-xs text-muted-foreground">
                      Final delivery needs the code from the recipient — the
                      status dropdown cannot mark a delivery as delivered.
                    </p>
                    {confirmForm.formState.errors.code ? (
                      <p className="text-xs text-destructive">
                        {confirmForm.formState.errors.code.message}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={confirmMutation.isPending}
                  >
                    {confirmMutation.isPending
                      ? "Confirming..."
                      : "Confirm delivery"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
