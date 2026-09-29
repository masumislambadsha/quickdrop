import { ArrowUpRight, CreditCard, PackagePlus, Radar } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";

function BookPreview() {
  return (
    <div className="rounded-2xl bg-mint p-4">
      <div className="space-y-2">
        {["Sender · Dhaka", "Parcel · 2 kg", "Express"].map((t) => (
          <div
            key={t}
            className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-ink shadow-sm"
          >
            {t}
          </div>
        ))}
        <div className="rounded-full bg-ink px-3 py-2 text-center text-xs font-bold text-lime">
          Book & pay →
        </div>
      </div>
    </div>
  );
}

function TrackPreview() {
  return (
    <div className="rounded-2xl bg-mint p-4">
      <p className="font-mono text-xs font-bold text-ink">QD-100020</p>
      <div className="mt-2 flex gap-1.5">
        {["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].map((s) => (
          <span key={s} className="h-2 flex-1 rounded-full bg-forest" />
        ))}
        <span className="h-2 flex-1 rounded-full bg-ink/10" />
      </div>
      <div className="mt-3">
        <StatusBadge status="OUT_FOR_DELIVERY" />
      </div>
    </div>
  );
}

function PayPreview() {
  return (
    <div className="rounded-2xl bg-mint p-4">
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <p className="text-xs text-ink/60">Stripe Checkout</p>
        <p className="display text-2xl text-ink">$24.50</p>
      </div>
      <div className="mt-2 rounded-full bg-lime px-3 py-2 text-center text-xs font-black text-ink">
        Paid ✓
      </div>
    </div>
  );
}

const cards = [
  {
    icon: PackagePlus,
    title: "Book in minutes",
    text: "A 3-step wizard with live price estimates across Standard, Express, and Same-Day tiers.",
    cta: "Start booking",
    href: "/register",
    Preview: BookPreview,
  },
  {
    icon: Radar,
    title: "Track everything",
    text: "Every pickup, hub transfer, and delivery attempt lands on a timestamped public timeline.",
    cta: "Track now",
    href: "/track",
    Preview: TrackPreview,
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    text: "Per-shipment Stripe Checkout with receipts, history, and automatic paid-status webhooks.",
    cta: "See pricing",
    href: "/pricing",
    Preview: PayPreview,
  },
];

export function Features() {
  return (
    <section className="bg-cream py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeading
          eyebrow="What you get"
          title="Tools to keep you"
          highlight="delivering."
          description="Booking, tracking, and payments in one place — no phone calls, no spreadsheets, no wondering where your parcel is."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="card-float h-full p-6">
                <c.Preview />
                <div className="mt-5 flex items-center gap-2">
                  <c.icon className="h-5 w-5 text-forest" strokeWidth={2.5} />
                  <h3 className="display text-xl text-ink">{c.title}</h3>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-[#444]">
                  {c.text}
                </p>
                <a
                  href={c.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest hover:gap-2"
                >
                  {c.cta} <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
