import { Zap } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";

export function EventBanner() {
  return (
    <section className="bg-ink pb-4">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-4 rounded-[20px] bg-pop p-6 text-ink md:flex-row md:p-7">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-lime">
                <Zap className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <div>
                <p className="display text-2xl md:text-3xl">
                  Same-Day is live in Dhaka.
                </p>
                <p className="mt-1 text-sm font-medium text-ink/70">
                  Order before noon, at the doorstep by evening — 2× standard
                  rate.
                </p>
              </div>
            </div>
            <a
              href="/dashboard/shipments/new"
              className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-bold text-lime transition-transform hover:scale-[1.02]"
            >
              Try Same-Day
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const brands = [
  "Chaya & Co.",
  "ParcelPoint",
  "FreshBox",
  "BookHive",
  "MediSend",
  "CraftKori",
];

export function TrustStrip() {
  return (
    <section className="border-b border-ink/10 bg-cream py-8">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
          Trusted by 10,000+ senders
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {brands.map((b) => (
            <span key={b} className="display text-lg text-ink/35">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
