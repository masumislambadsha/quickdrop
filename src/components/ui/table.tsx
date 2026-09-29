import type {
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto rounded-[20px] border border-ink/10 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("bg-ink [&_tr]:border-b-0", className)} {...props} />
  );
}

export function TableBody({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  );
}

export function TableRow({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-ink/8 transition-colors last:border-0 hover:bg-cream",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-12 whitespace-nowrap px-4 text-left align-middle text-xs font-black uppercase tracking-[0.08em] text-lime first:rounded-tl-[20px] last:rounded-tr-[20px]",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}
