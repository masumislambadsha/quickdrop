"use client";

import { cn } from "@/lib/utils";

export type DoodleShape =
  | "star"
  | "arrow"
  | "spark"
  | "pin"
  | "box"
  | "check"
  | "lines";
export type DoodleColor = "lime" | "orange" | "white";

export interface DoodleSpec {
  shape: DoodleShape;
  color: DoodleColor;
  /** absolute positioning + rotation, e.g. "-left-2 -top-6 -rotate-12" */
  className: string;
  /** stagger so they don't move together */
  delay?: number;
  size?: number;
}

const colorClass: Record<DoodleColor, string> = {
  lime: "text-lime",
  orange: "text-pop",
  white: "text-white",
};

function DecoSvg({
  label,
  size,
  children,
  ...props
}: {
  label: string;
  size: number;
  children: React.ReactNode;
} & Omit<React.SVGProps<SVGSVGElement>, "children" | "width" | "height">) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" {...props}>
      <title>{label}</title>
      {children}
    </svg>
  );
}

function Shape({ shape, size }: { shape: DoodleShape; size: number }) {
  switch (shape) {
    case "star":
      return (
        <DecoSvg label="star doodle" size={size} fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </DecoSvg>
      );
    case "spark":
      return (
        <DecoSvg label="sparkle doodle" size={size} fill="currentColor">
          <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
          <circle cx="19" cy="18" r="2" />
          <circle cx="5" cy="19" r="1.4" />
        </DecoSvg>
      );
    case "arrow":
      return (
        <DecoSvg
          label="arrow doodle"
          size={size}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M6 18L18 6M8 6h10v10" />
        </DecoSvg>
      );
    case "pin":
      return (
        <DecoSvg label="pin doodle" size={size} fill="currentColor">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
        </DecoSvg>
      );
    case "box":
      return (
        <DecoSvg
          label="package doodle"
          size={size}
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" />
        </DecoSvg>
      );
    case "check":
      return (
        <DecoSvg
          label="checkmark doodle"
          size={size}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
        </DecoSvg>
      );
    case "lines":
      return (
        <DecoSvg
          label="speed lines doodle"
          size={size}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        >
          <path d="M3 8h11M5 12h11M3 16h11" />
        </DecoSvg>
      );
  }
}

/**
 * Hand-placed sticker doodles floating AROUND a heading block.
 * Parent must be `relative`. Rotation lives on the outer span so the
 * float animation (inner svg, translateY only) never overrides it.
 */
export function Doodles({ items }: { items: DoodleSpec[] }) {
  return (
    <>
      {items.map((d) => (
        <span
          key={`${d.shape}-${d.className}`}
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-10",
            d.className,
            colorClass[d.color],
          )}
        >
          <span
            className="doodle-float block"
            style={{ animationDelay: `${d.delay ?? 0}s` }}
          >
            <Shape shape={d.shape} size={d.size ?? 26} />
          </span>
        </span>
      ))}
    </>
  );
}
