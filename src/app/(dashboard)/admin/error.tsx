"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h2 className="text-xl font-bold">Couldn&apos;t load admin section</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.message ||
          "An unexpected error occurred in the admin dashboard."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
