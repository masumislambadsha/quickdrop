import { Reveal } from "@/components/brand/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  after,
  description,
  dark = false,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  after?: string;
  description?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "pill-tag mb-5",
            dark ? "bg-lime text-ink" : "bg-ink text-lime",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "display text-[clamp(32px,5vw,64px)]",
          dark ? "text-lime" : "text-ink",
        )}
      >
        {title}{" "}
        {highlight ? (
          <span className={dark ? "text-cream" : "text-forest"}>
            {highlight}
          </span>
        ) : null}{" "}
        {after}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed",
            dark ? "text-white/70" : "text-[#444]",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
