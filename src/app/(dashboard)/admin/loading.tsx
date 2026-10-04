import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="grid gap-4">
      <span className="sr-only">Loading admin section…</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["a", "b", "c", "d"].map((k) => (
          <Skeleton key={k} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
      <div className="grid gap-2">
        {["r1", "r2", "r3"].map((k) => (
          <Skeleton key={k} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
