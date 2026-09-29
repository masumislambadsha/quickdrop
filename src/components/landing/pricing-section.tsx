import { BadgePercent, Package, Timer } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { Sticker } from "@/components/brand/sticker";
import { PricingCalculator } from "@/components/modules/pricing/pricing-calculator";

export function PricingSection() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 md:py-28">
      <Sticker
        icon={Package}
        index={1}
        className="absolute left-[6%] top-24 hidden bg-pop text-ink lg:inline-flex"
      />
      <Sticker
        icon={Timer}
        index={3}
        className="absolute bottom-24 right-[7%] hidden bg-lime text-ink lg:inline-flex"
        size="sm"
      />
      <div className="relative mx-auto max-w-[1200px] px-6">
        <SectionHeading
          eyebrow="Transparent pricing"
          title="Yes, you can afford"
          highlight="fast."
          description="Base fare plus distance and weight — adjusted by speed tier and package type. Estimate it right here, same math as the backend."
        />
        <Reveal className="mx-auto mt-10 max-w-2xl" delay={0.1}>
          <div className="card-float p-2">
            <PricingCalculator />
          </div>
        </Reveal>
        <Reveal className="mt-6 text-center" delay={0.15}>
          <p className="pill-tag bg-pop/20 text-ink">
            <BadgePercent className="h-3.5 w-3.5" /> No hidden fees · Pay per
            shipment
          </p>
        </Reveal>
      </div>
    </section>
  );
}
