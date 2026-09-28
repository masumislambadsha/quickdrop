"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateShipment, useInitiatePayment } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

const wizardSchema = z.object({
  senderName: z
    .string()
    .min(2, "Sender name must be at least 2 characters")
    .max(100),
  senderPhone: z
    .string()
    .min(7, "Sender phone must be at least 7 characters")
    .max(20),
  recipientName: z
    .string()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100),
  recipientPhone: z
    .string()
    .min(7, "Recipient phone must be at least 7 characters")
    .max(20),
  origin: z.string().min(2, "Origin must be at least 2 characters").max(100),
  destination: z
    .string()
    .min(2, "Destination must be at least 2 characters")
    .max(100),
  distanceKm: z.coerce
    .number()
    .positive("Distance must be greater than 0")
    .max(100000),
  weightKg: z.coerce
    .number()
    .positive("Weight must be greater than 0")
    .max(100000),
  packageType: z.enum(["DOCUMENT", "PARCEL", "FRAGILE", "PERISHABLE", "HEAVY"]),
  pricingTier: z.enum(["STANDARD", "EXPRESS", "SAME_DAY"]),
  declaredValue: z.coerce.number().nonnegative().optional(),
  notes: z.string().max(1000).optional(),
});

type WizardValues = z.infer<typeof wizardSchema>;

const STEP_FIELDS: Record<number, (keyof WizardValues)[]> = {
  1: ["senderName", "senderPhone", "recipientName", "recipientPhone"],
  2: [
    "origin",
    "destination",
    "distanceKm",
    "weightKg",
    "packageType",
    "pricingTier",
  ],
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function ShipmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [payNow, setPayNow] = useState(true);
  const createMutation = useCreateShipment();
  const payMutation = useInitiatePayment();

  const form = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema) as Resolver<WizardValues>,
    defaultValues: {
      senderName: "",
      senderPhone: "",
      recipientName: "",
      recipientPhone: "",
      origin: "Dhaka",
      destination: "",
      distanceKm: 100,
      weightKg: 1,
      packageType: "PARCEL",
      pricingTier: "STANDARD",
      declaredValue: 0,
      notes: "",
    },
    mode: "onTouched",
  });

  const next = async () => {
    const ok = await form.trigger(STEP_FIELDS[step]);
    if (ok) setStep((s) => Math.min(3, s + 1));
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const res = await createMutation.mutateAsync({
        senderName: values.senderName,
        senderPhone: values.senderPhone,
        recipientName: values.recipientName,
        recipientPhone: values.recipientPhone,
        origin: values.origin,
        destination: values.destination,
        distanceKm: values.distanceKm,
        weightKg: values.weightKg,
        packageType: values.packageType,
        pricingTier: values.pricingTier,
        declaredValue: values.declaredValue ?? 0,
        notes: values.notes || undefined,
      });
      const shipmentId = res.data.id;
      toast.success(`Shipment ${res.data.trackingNumber} created.`);
      if (payNow) {
        toast.info("Redirecting to Stripe Checkout...");
        await payMutation.mutateAsync(shipmentId);
      } else {
        router.push(`/dashboard/shipments/${shipmentId}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create shipment."));
    }
  });

  const busy = createMutation.isPending || payMutation.isPending;
  const e = form.formState.errors;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create shipment — step {step} of 3</CardTitle>
        <CardDescription>
          {step === 1 && "Who is sending, and who receives?"}
          {step === 2 && "What are you shipping, and how fast?"}
          {step === 3 && "Review everything, then book and pay."}
        </CardDescription>
        <div className="flex gap-1 pt-2">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Sender name" error={e.senderName?.message}>
                  <Input
                    {...form.register("senderName")}
                    placeholder="Your full name"
                  />
                </Field>
                <Field label="Sender phone" error={e.senderPhone?.message}>
                  <Input
                    {...form.register("senderPhone")}
                    placeholder="+880..."
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Recipient name" error={e.recipientName?.message}>
                  <Input
                    {...form.register("recipientName")}
                    placeholder="Receiver's name"
                  />
                </Field>
                <Field
                  label="Recipient phone"
                  error={e.recipientPhone?.message}
                >
                  <Input
                    {...form.register("recipientPhone")}
                    placeholder="+880..."
                  />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Origin city" error={e.origin?.message}>
                  <Input {...form.register("origin")} />
                </Field>
                <Field label="Destination city" error={e.destination?.message}>
                  <Input
                    {...form.register("destination")}
                    placeholder="e.g. Chattogram"
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Distance (km)" error={e.distanceKm?.message}>
                  <Input
                    type="number"
                    min={1}
                    {...form.register("distanceKm")}
                  />
                </Field>
                <Field label="Weight (kg)" error={e.weightKg?.message}>
                  <Input
                    type="number"
                    min={0.1}
                    step={0.1}
                    {...form.register("weightKg")}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Package type" error={e.packageType?.message}>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    {...form.register("packageType")}
                  >
                    <option value="DOCUMENT">Document</option>
                    <option value="PARCEL">Parcel</option>
                    <option value="FRAGILE">Fragile</option>
                    <option value="PERISHABLE">Perishable</option>
                    <option value="HEAVY">Heavy</option>
                  </select>
                </Field>
                <Field label="Speed tier" error={e.pricingTier?.message}>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    {...form.register("pricingTier")}
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="EXPRESS">Express ×1.5</option>
                    <option value="SAME_DAY">Same-day ×2</option>
                  </select>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Declared value ($, optional)"
                  error={e.declaredValue?.message}
                >
                  <Input
                    type="number"
                    min={0}
                    {...form.register("declaredValue")}
                  />
                </Field>
                <Field label="Notes (optional)" error={e.notes?.message}>
                  <Input
                    {...form.register("notes")}
                    placeholder="Delivery instructions"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <dl className="grid gap-2 rounded-md border p-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">From</dt>
                  <dd className="font-medium">
                    {form.watch("senderName")} · {form.watch("origin")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">To</dt>
                  <dd className="font-medium">
                    {form.watch("recipientName")} · {form.watch("destination")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Parcel</dt>
                  <dd className="font-medium">
                    {form.watch("weightKg")} kg · {form.watch("packageType")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tier</dt>
                  <dd className="font-medium">{form.watch("pricingTier")}</dd>
                </div>
              </dl>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={payNow}
                  onChange={(ev) => setPayNow(ev.target.checked)}
                  className="h-4 w-4"
                />
                Pay now with Stripe Checkout (test mode)
              </label>
            </>
          )}

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={step === 1 || busy}
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={busy}>
                {busy
                  ? "Processing..."
                  : payNow
                    ? "Book & pay with Stripe"
                    : "Book shipment"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
