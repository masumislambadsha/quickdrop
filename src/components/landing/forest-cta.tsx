import { ArrowRight, PartyPopper } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { Sticker } from "@/components/brand/sticker";

export function ForestCta() {
  return (
    <section className="bg-forest py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <Sticker
                icon={PartyPopper}
                index={2}
                size="lg"
                className="absolute -top-8 right-8 bg-pop text-ink"
              />
              <h2 className="display text-[clamp(40px,6vw,80px)] text-lime">
                Let&apos;s move.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-mint md:text-lg">
                Your first shipment is three steps away. Book it, track it, and
                get it signed for — all before lunch.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/register" className="btn-lime">
                  Book my first shipment <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/track"
                  className="rounded-full border-2 border-mint px-7 py-3.5 text-sm font-bold text-mint transition-transform hover:scale-[1.02]"
                >
                  Track a parcel
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[20px] bg-ink/40 p-6 backdrop-blur">
              <p className="pill-tag bg-lime text-ink">How booking works</p>
              <ol className="mt-5 space-y-4">
                {[
                  { n: "1", t: "Tell us sender, recipient, and route" },
                  { n: "2", t: "Describe the parcel, pick a speed" },
                  { n: "3", t: "Review, book, and pay with Stripe" },
                ].map((s) => (
                  <li key={s.n} className="flex items-center gap-4">
                    <span className="display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime text-xl text-ink">
                      {s.n}
                    </span>
                    <p className="font-semibold text-cream">{s.t}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
