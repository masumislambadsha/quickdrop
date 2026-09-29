"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PackageType, PricingTier } from "@/types";

function estimate(
  distanceKm: number,
  weightKg: number,
  tier: PricingTier,
  type: PackageType,
): number {
  const base = 150;
  const tierMult = tier === "STANDARD" ? 1 : tier === "EXPRESS" ? 1.5 : 2;
  const typeMult =
    type === "DOCUMENT"
      ? 0.7
      : type === "FRAGILE"
        ? 1.4
        : type === "PERISHABLE"
          ? 1.6
          : type === "HEAVY"
            ? 1.8
            : 1;
  return Number(
    ((base + distanceKm * 0.5 + weightKg * 25) * tierMult * typeMult).toFixed(
      2,
    ),
  );
}

export function PricingCalculator() {
  const [distance, setDistance] = useState(120);
  const [weight, setWeight] = useState(2);
  const [tier, setTier] = useState<PricingTier>("STANDARD");
  const [type, setType] = useState<PackageType>("PARCEL");

  const cost = useMemo(
    () => estimate(distance || 0, weight || 0, tier, type),
    [distance, weight, tier, type],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery cost estimator</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="calc-distance">Distance (km)</Label>
          <Input
            id="calc-distance"
            type="number"
            min={1}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="calc-weight">Weight (kg)</Label>
          <Input
            id="calc-weight"
            type="number"
            min={0.1}
            step={0.1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="calc-tier">Pricing tier</Label>
          <select
            id="calc-tier"
            className="h-11 w-full rounded-full border-2 border-ink/15 bg-white px-4 text-sm font-semibold text-ink focus:border-leaf focus:outline-none"
            value={tier}
            onChange={(e) => setTier(e.target.value as PricingTier)}
          >
            <option value="STANDARD">Standard</option>
            <option value="EXPRESS">Express ×1.5</option>
            <option value="SAME_DAY">Same-day ×2</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="calc-type">Package type</Label>
          <select
            id="calc-type"
            className="h-11 w-full rounded-full border-2 border-ink/15 bg-white px-4 text-sm font-semibold text-ink focus:border-leaf focus:outline-none"
            value={type}
            onChange={(e) => setType(e.target.value as PackageType)}
          >
            <option value="DOCUMENT">Document</option>
            <option value="PARCEL">Parcel</option>
            <option value="FRAGILE">Fragile</option>
            <option value="PERISHABLE">Perishable</option>
            <option value="HEAVY">Heavy</option>
          </select>
        </div>
        <p className="sm:col-span-2 rounded-md bg-muted p-4 text-center text-xl font-bold">
          ≈ ${cost.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
}
