import { Bike, ShieldCheck, UserRound } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";

const roles = [
  {
    icon: UserRound,
    title: "Customer",
    text: "Book, pay, and follow every parcel from doorstep to doorstep.",
    pills: ["3-step booking", "Live timeline", "Receipts"],
  },
  {
    icon: Bike,
    title: "Courier",
    text: "A clean job queue, field status updates, and confirmed deliveries.",
    pills: ["Job queue", "Status updates", "Earnings"],
  },
  {
    icon: ShieldCheck,
    title: "Operations",
    text: "Assign couriers without double-booking, verify payments, audit everything.",
    pills: ["Assign", "Analytics", "Audit logs"],
  },
];

export function RolesBand() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-28">
      <div className="hero-grid absolute inset-0" />
      <div className="relative mx-auto max-w-[1200px] px-6">
        <SectionHeading
          dark
          eyebrow="One platform"
          title="Three roles."
          highlight="Zero chaos."
          description="Everyone sees exactly their world — customers book, couriers deliver, operations orchestrates."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {roles.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <div className="h-full rounded-[20px] border border-pine bg-pine/60 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-ink">
                  <r.icon className="h-6 w-6" strokeWidth={2.5} />
                </span>
                <h3 className="display mt-4 text-2xl text-cream">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                  {r.text}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.pills.map((p) => (
                    <span
                      key={p}
                      className="pill-tag border border-lime/30 text-lime"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <a href="/login" className="btn-lime">
            Try a one-click demo login
          </a>
        </Reveal>
      </div>
    </section>
  );
}
