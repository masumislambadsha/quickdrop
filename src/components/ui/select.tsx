"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Select({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange}>
      <SelectPrimitive.Trigger
        aria-label={label}
        className={cn(
          "inline-flex h-10 w-full min-w-0 max-w-full items-center justify-between gap-2 rounded-full border-2 border-ink/15 bg-white px-4 text-sm font-semibold text-ink hover:border-ink/40 focus:outline-none cursor-pointer [&>span]:min-w-0 [&>span]:flex-1 [&>span]:truncate",
          className,
        )}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          className="z-50 max-w-[calc(100vw-2rem)] min-w-44 overflow-hidden rounded-2xl border border-ink/10 bg-white p-1.5 shadow-xl"
        >
          <SelectPrimitive.Viewport className="max-h-[50vh] overflow-y-auto">
            {options.map((o) => (
              <SelectPrimitive.Item
                key={o.value}
                value={o.value}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-medium outline-none hover:bg-cream data-[state=checked]:bg-mint"
              >
                <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Check className="h-4 w-4 text-forest" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
