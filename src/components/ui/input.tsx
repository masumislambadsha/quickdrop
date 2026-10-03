import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full min-w-0 rounded-full border-2 border-ink/15 bg-white px-4 py-2 text-base font-medium text-ink placeholder:text-ink/35 focus:border-leaf focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}
