import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerLoading() {
  return (
    <div className="grid gap-4">
      <span className="sr-only">Loading customer dashboard…</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["a", "b", "c"].map((k) => (
          <Skeleton key={k} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-2">
        {["r1", "r2", "r3", "r4"].map((k) => (
          <Skeleton key={k} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
