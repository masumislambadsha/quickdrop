"use client";

import {
  ArrowRight,
  Bike,
  MapPin,
  PackageCheck,
  Radar,
  Search,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Doodles } from "@/components/brand/doodles";
import { Reveal } from "@/components/brand/reveal";
import { Sticker } from "@/components/brand/sticker";
import { StatusBadge } from "@/components/ui/status-badge";

const STOPS = [
  { city: "Dhaka", detail: "Picked up · 09:42 AM", done: true },
  { city: "Hub transfer", detail: "Sorted · 01:15 PM", done: true },
  { city: "Chattogram", detail: "Arrived · 06:03 PM", done: true },
  { city: "Doorstep", detail: "Arriving today", done: false },
];

function RouteVisual() {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-lime/15 bg-pine/90 p-5 shadow-2xl shadow-ink/60 backdrop-blur-md sm:p-6">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="pill-tag bg-lime text-ink">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink" />
            </span>
            Live shipment
          </p>
          <p className="font-mono text-xs text-cream/60">QD-100020</p>
        </div>
        <div className="mt-5">
          {STOPS.map((s, i) => (
            <div key={s.city} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    s.done
                      ? "bg-lime text-ink"
                      : "border-2 border-dashed border-lime/60 text-lime"
                  }`}
                >
                  {s.done ? (
                    <PackageCheck className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                </span>
                {i < STOPS.length - 1 && (
                  <span
                    className={`w-0.5 flex-1 py-0.5 ${
                      s.done ? "bg-lime" : "bg-lime/25"
                    }`}
                    style={{ minHeight: "18px" }}
                  />
                )}
              </div>
              <div className="pb-4 last:pb-0">
                <p className="text-sm font-bold text-cream">{s.city}</p>
                <p className="text-xs text-cream/50">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-ink/70 px-3 py-2.5">
          <StatusBadge status="OUT_FOR_DELIVERY" />
          <p className="text-xs font-semibold text-cream/70">
            Courier 2 min away
          </p>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [tn, setTn] = useState("");

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* base washes — replaces the unrelated field photo that killed contrast */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-lime/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[380px] w-[380px] rounded-full bg-pop/10 blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
      </div>
      <div className="hero-grid absolute inset-0" aria-hidden />

      {/* decorative stickers — kept well inside the section so they never clip */}
      <Sticker
        icon={Star}
        index={0}
        className="pointer-events-none absolute left-6 top-24 z-10 hidden bg-lime text-ink lg:inline-flex"
      />
      <Sticker
        icon={Truck}
        index={1}
        className="pointer-events-none absolute bottom-10 left-8 z-10 hidden bg-pop text-ink lg:inline-flex"
        size="lg"
      />
      <Sticker
        icon={Sparkles}
        index={3}
        className="pointer-events-none absolute right-8 top-24 z-10 hidden bg-cream text-ink md:inline-flex"
      />
      <Sticker
        icon={Bike}
        index={4}
        className="pointer-events-none absolute bottom-12 right-8 z-10 hidden bg-lime text-ink lg:inline-flex"
        size="sm"
      />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 px-6 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-28">
        <div className="relative">
          <Doodles
            items={[
              {
                shape: "star",
                color: "lime",
                className: "-left-2 -top-9 -rotate-12",
                delay: 0,
                size: 30,
              },
              {
                shape: "arrow",
                color: "orange",
                className: "-right-2 top-0 rotate-12",
                delay: 0.4,
                size: 28,
              },
              {
                shape: "check",
                color: "white",
                className: "-left-4 bottom-28 rotate-6",
                delay: 0.8,
                size: 26,
              },
              {
                shape: "lines",
                color: "lime",
                className: "right-10 -bottom-5 -rotate-6",
                delay: 1.2,
                size: 30,
              },
            ]}
          />
          <Reveal>
            <p className="pill-tag bg-lime/15 text-lime">
              Courier & logistics platform
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display display-on-dark mt-5 text-[clamp(40px,11vw,84px)]">
              You&apos;re free
              <br />
              to ship.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              Book in minutes, watch every milestone live, and pay securely.
              Built for customers, couriers, and operations teams.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <form
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-lime/25 bg-white/5 p-2 pl-5 backdrop-blur transition focus-within:border-lime/60 focus-within:ring-2 focus-within:ring-lime/20"
              onSubmit={(e) => {
                e.preventDefault();
                if (tn.trim())
                  router.push(`/track?tn=${encodeURIComponent(tn.trim())}`);
              }}
            >
              <Search className="h-4 w-4 shrink-0 text-lime" />
              <input
                value={tn}
                onChange={(e) => setTn(e.target.value)}
                placeholder="Enter tracking number…"
                aria-label="Tracking number"
                className="w-full min-w-0 bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
              />
              <button
                type="submit"
                className="btn-lime shrink-0 !px-5 !py-2.5 !text-sm"
              >
                Track <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/register" className="btn-lime">
                <Radar className="h-4 w-4" /> Book a shipment
              </a>
              <a href="/pricing" className="btn-ghost-light">
                See pricing
              </a>
            </div>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[520px] pb-10 lg:pb-0"
        >
          {/* photo card */}
          <div className="relative h-[440px] overflow-hidden rounded-[24px] border border-lime/15 shadow-2xl shadow-ink/50 sm:h-[500px] lg:h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"
              alt="Courier handling parcels in a logistics hub"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover object-center"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20"
              aria-hidden
            />
            {/* badge — anchored to the photo so it can't float or clip.
                Route chip removed: it collided with this badge under 380px. */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-3 top-3 z-20 rotate-2 rounded-2xl bg-lime px-3 py-2 shadow-xl sm:right-4 sm:top-4 sm:px-4 sm:py-2.5"
            >
              <p className="text-xs font-black uppercase tracking-wide text-ink">
                Delivered
              </p>
              <p className="font-mono text-sm font-bold text-ink">
                12,408 parcels
              </p>
            </motion.div>
          </div>

          {/* tracking card — in-flow on mobile, overlapping on desktop */}
          <div className="relative z-10 mx-4 -mt-28 sm:mx-6 lg:absolute lg:bottom-6 lg:left-[-2.5rem] lg:mx-0 lg:-mt-0 lg:w-[330px]">
            <RouteVisual />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
