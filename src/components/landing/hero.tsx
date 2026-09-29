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

function RouteVisual() {
  const stops = [
    { city: "Dhaka", done: true },
    { city: "Hub transfer", done: true },
    { city: "Chattogram", done: true },
    { city: "Doorstep", done: false },
  ];
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-lime/15 bg-pine/85 p-6 backdrop-blur-sm">
      <div className="hero-grid absolute inset-0" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="pill-tag bg-lime text-ink">Live shipment</p>
          <p className="font-mono text-xs text-cream/60">QD-100020</p>
        </div>
        <div className="mt-6 space-y-0">
          {stops.map((s, i) => (
            <div key={s.city} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    s.done
                      ? "bg-lime text-ink"
                      : "border-2 border-dashed border-lime/50 text-lime"
                  }`}
                >
                  {s.done ? (
                    <PackageCheck className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                </span>
                {i < stops.length - 1 && (
                  <span
                    className={`h-6 w-0.5 ${s.done ? "bg-lime" : "bg-lime/25"}`}
                  />
                )}
              </div>
              <div className="pb-5">
                <p className="text-sm font-bold text-cream">{s.city}</p>
                <p className="text-xs text-cream/50">
                  {s.done ? "Completed · timestamped" : "Arriving today"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-ink/60 p-3">
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
    <section className="relative overflow-hidden bg-ink">
      <div className="hero-grid absolute inset-0" />
      <Sticker
        icon={Star}
        index={0}
        className="absolute left-[3%] top-64 hidden bg-lime text-ink lg:inline-flex"
      />
      <Sticker
        icon={Truck}
        index={1}
        className="absolute bottom-32 left-[4%] hidden bg-pop text-ink lg:inline-flex"
        size="lg"
      />
      <Sticker
        icon={Sparkles}
        index={3}
        className="absolute right-[6%] top-20 hidden bg-cream text-ink md:inline-flex"
      />
      <Sticker
        icon={Bike}
        index={4}
        className="absolute bottom-24 right-[10%] hidden bg-lime text-ink lg:inline-flex"
        size="sm"
      />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2">
        <div className="relative">
          <Doodles
            items={[
              {
                shape: "star",
                color: "lime",
                className: "-left-3 -top-8 -rotate-12",
                delay: 0,
                size: 30,
              },
              {
                shape: "arrow",
                color: "orange",
                className: "-right-4 top-2 rotate-12",
                delay: 0.4,
                size: 28,
              },
              {
                shape: "check",
                color: "white",
                className: "-left-6 bottom-10 rotate-6",
                delay: 0.8,
                size: 26,
              },
              {
                shape: "lines",
                color: "lime",
                className: "right-10 -bottom-4 -rotate-6",
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
            <h1 className="display display-on-dark mt-5 text-[clamp(48px,7vw,96px)]">
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
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-lime/25 bg-white/5 p-2 pl-5 backdrop-blur"
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
                className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
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
          className="relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80"
            alt="Confident courier partner smiling"
            fill
            priority
            sizes="(max-width: 1024px) 0, 45vw"
            className="hero-photo-fade pointer-events-none absolute -right-6 top-1/2 hidden h-[115%] w-[62%] -translate-y-1/2 rounded-[20px] object-cover opacity-85 mix-blend-luminosity lg:block"
          />
          <div className="relative z-10 lg:mr-[38%]">
            <RouteVisual />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 -top-5 z-20 rounded-2xl bg-lime px-4 py-2.5 shadow-xl md:-left-8"
          >
            <p className="text-xs font-black uppercase tracking-wide text-ink">
              Delivered
            </p>
            <p className="font-mono text-sm font-bold text-ink">
              12,408 parcels
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
