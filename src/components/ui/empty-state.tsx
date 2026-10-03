import { PackageSearch } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-10 text-center sm:py-16">
      <PackageSearch className="h-10 w-10 shrink-0 text-muted-foreground" />
      <h3 className="break-words text-lg font-semibold">{title}</h3>
      {description ? (
        <p className="w-full max-w-sm break-words text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? (
        <div className="mt-1 flex w-full justify-center">{action}</div>
      ) : null}
    </div>
  );
}
