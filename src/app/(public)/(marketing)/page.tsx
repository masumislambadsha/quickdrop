import type { Metadata } from "next";
import { EventBanner, TrustStrip } from "@/components/landing/banner-strip";
import { Features } from "@/components/landing/features";
import { ForestCta } from "@/components/landing/forest-cta";
import { Hero } from "@/components/landing/hero";
import { PricingSection } from "@/components/landing/pricing-section";
import { RolePaths, SuccessStats } from "@/components/landing/role-paths";
import { RolesBand } from "@/components/landing/roles-band";

export const metadata: Metadata = {
  title: "QuickDrop — Fast, Trackable Courier & Logistics",
  description:
    "Book shipments in minutes, track every parcel milestone, and pay securely with Stripe. Built for customers, couriers, and operations teams.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <EventBanner />
      <TrustStrip />
      <Features />
      <RolesBand />
      <PricingSection />
      <RolePaths />
      <SuccessStats />
      <ForestCta />
    </>
  );
}
