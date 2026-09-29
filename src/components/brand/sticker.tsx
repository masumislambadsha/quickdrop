import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const rotations = [
  "-rotate-8",
  "rotate-6",
  "-rotate-6",
  "rotate-12",
  "-rotate-12",
  "rotate-3",
];

export function Sticker({
  icon: Icon,
  className,
  index = 0,
  size = "md",
}: {
  icon: LucideIcon;
  className?: string;
  index?: number;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const iconDims =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5";
  return (
    <span
      className={cn(
        "sticker",
        dims,
        rotations[index % rotations.length],
        className,
      )}
    >
      <Icon className={iconDims} strokeWidth={2.5} />
    </span>
  );
}
