import { ArrowRight, PartyPopper } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/brand/reveal";
import { Sticker } from "@/components/brand/sticker";

export function ForestCta() {
  return (
    <section className="bg-forest py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <div className="relative mb-10 overflow-hidden rounded-[20px]">
            <div className="relative h-64 md:h-80">
              <Image
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&q=80"
                alt="Delivery routes across the country at dawn"
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/25" />
            </div>
            <div className="absolute left-4 top-4 flex flex-wrap gap-2 md:left-6 md:top-6">
              {["Dhaka", "Chattogram", "Sylhet", "Khulna", "+8 cities"].map(
                (c) => (
                  <span
                    key={c}
                    className="rounded-full bg-cream/95 px-3.5 py-1.5 text-xs font-black text-ink shadow-lg"
                  >
                    {c}
                  </span>
                ),
              )}
            </div>
            <p className="display absolute bottom-4 left-4 text-3xl text-cream drop-shadow-lg md:bottom-6 md:left-6 md:text-4xl">
              Routes everywhere you are.
            </p>
          </div>
        </Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <Sticker
                icon={PartyPopper}
                index={2}
                size="lg"
                className="absolute -top-8 right-8 bg-pop text-ink"
              />
              <h2 className="display display-on-dark text-[clamp(40px,6vw,80px)]">
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
