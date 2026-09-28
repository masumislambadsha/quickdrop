import type { Metadata } from "next";
import { PricingCalculator } from "@/components/modules/pricing/pricing-calculator";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent QuickDrop pricing — base fare plus distance and weight, adjusted by speed tier and package type.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold md:text-4xl">Pricing</h1>
      <p className="mt-3 text-muted-foreground">
        No hidden fees. Cost = (150 base + 0.5 × distance in km + 25 × weight in
        kg) × tier multiplier × package multiplier. Standard ×1, Express ×1.5,
        Same-Day ×2. Documents ×0.7, Fragile ×1.4, Perishable ×1.6, Heavy ×1.8.
      </p>
      <div className="mt-8">
        <PricingCalculator />
      </div>
    </div>
  );
}
