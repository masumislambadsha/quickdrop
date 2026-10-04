import { Skeleton } from "@/components/ui/skeleton";

export default function CourierLoading() {
  return (
    <div className="grid gap-4">
      <span className="sr-only">Loading courier tasks…</span>
      <div className="flex gap-2 overflow-hidden">
        {["a", "b", "c"].map((k) => (
          <Skeleton key={k} className="h-28 w-[240px] shrink-0 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-2">
        {["r1", "r2", "r3", "r4", "r5"].map((k) => (
          <Skeleton key={k} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
