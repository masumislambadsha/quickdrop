import { Package } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: {
    track: "w-32",
    parcel: "h-8 w-8",
    icon: "h-4 w-4",
    dot: "h-1.5 w-1.5",
    label: "text-base",
    /** track width minus parcel width, so the parcel rides end to end */
    travel: "96px",
  },
  md: {
    track: "w-44",
    parcel: "h-10 w-10",
    icon: "h-5 w-5",
    dot: "h-2 w-2",
    label: "text-xl",
    travel: "136px",
  },
  lg: {
    track: "w-56",
    parcel: "h-12 w-12",
    icon: "h-6 w-6",
    dot: "h-2 w-2",
    label: "text-2xl",
    travel: "176px",
  },
} as const;

type LoaderSize = keyof typeof sizes;

/**
 * QuickDrop-themed loader — a lime parcel riding a dashed delivery
 * route with stops lighting up in sequence.
 *
 * @param label shown under the route in the brand display face
 * @param tone `light` for cream/white surfaces, `dark` for ink surfaces
 */
export function Loader({
  label = "Delivering…",
  size = "md",
  tone = "light",
  className,
}: {
  label?: string;
  size?: LoaderSize;
  tone?: "light" | "dark";
  className?: string;
}) {
  const s = sizes[size];
  const dark = tone === "dark";

  return (
    <div
      aria-live="polite"
      className={cn("flex flex-col items-center gap-4", className)}
    >
      <div className={cn("relative flex items-center", s.track)}>
        {/* dashed route with marching ants */}
        <div
          aria-hidden
          className={cn(
            "qd-route absolute right-2 left-2 h-0.5 rounded-full",
            dark ? "qd-route-dark" : "qd-route-light",
          )}
        />
        {/* stops lighting up in sequence */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            style={{ animationDelay: `${i * 0.35}s` }}
            className={cn(
              "qd-stop absolute rounded-full",
              s.dot,
              i === 0 && "left-0",
              i === 1 && "left-1/2 -translate-x-1/2",
              i === 2 && "right-0",
            )}
          />
        ))}
        {/* riding parcel */}
        <span
          aria-hidden
          style={{ "--qd-travel": s.travel } as CSSProperties}
          className={cn("qd-parcel sticker bg-lime text-ink", s.parcel)}
        >
          <Package className={s.icon} strokeWidth={2.5} />
        </span>
      </div>
      <p className={cn("display", s.label, dark ? "text-cream" : "text-ink")}>
        {label}
      </p>
    </div>
  );
}

/** Centered page-level loader for route Suspense fallbacks. */
export function PageLoader({
  label,
  size,
  tone,
  className,
}: {
  label?: string;
  size?: LoaderSize;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center px-4 py-10",
        className,
      )}
    >
      <Loader label={label} size={size} tone={tone} />
    </div>
  );
}
