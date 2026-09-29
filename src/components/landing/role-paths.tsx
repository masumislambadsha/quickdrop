import { ArrowRight, Bike, ClipboardList, LayoutDashboard } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";

const paths = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Customer path",
    text: "Register in seconds, book with the wizard, pay with Stripe, and watch the timeline until the doorbell rings.",
    href: "/register",
    cta: "Start shipping",
  },
  {
    icon: Bike,
    step: "02",
    title: "Courier path",
    text: "Open your queue, ride the route, update each milestone from the field, and confirm the handoff.",
    href: "/login",
    cta: "Open the queue",
  },
  {
    icon: LayoutDashboard,
    step: "03",
    title: "Operations path",
    text: "Match couriers to shipments, keep payments verified, and read the whole network from one analytics board.",
    href: "/login",
    cta: "See operations",
  },
];

export function RolePaths() {
  return (
    <section className="bg-white py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeading
          eyebrow="How it flows"
          title="One platform."
          highlight="Three paths to delivered."
          doodles={[
            {
              shape: "arrow",
              color: "lime",
              className: "-left-2 -top-3 -rotate-12",
              delay: 0,
              size: 28,
            },
            {
              shape: "box",
              color: "orange",
              className: "-right-3 top-8 rotate-6",
              delay: 0.8,
              size: 26,
            },
          ]}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {paths.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="card-float h-full border-2 border-mint p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-forest">
                    <p.icon className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <span className="display text-4xl text-ink/10">{p.step}</span>
                </div>
                <h3 className="display mt-4 text-2xl text-ink">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#444]">
                  {p.text}
                </p>
                <a
                  href={p.href}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-lime transition-transform hover:scale-[1.02]"
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "60K+", label: "parcels moved" },
  { value: "98%", label: "on-time delivery" },
  { value: "400+", label: "verified couriers" },
  { value: "12", label: "cities served" },
];

export function SuccessStats() {
  return (
    <section className="bg-white pb-24 md:pb-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <div className="grid grid-cols-2 gap-6 rounded-[20px] bg-ink p-8 md:grid-cols-4 md:p-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="display display-on-dark text-4xl md:text-5xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-cream">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
