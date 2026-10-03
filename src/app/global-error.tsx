"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center sm:p-8">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          We hit an unexpected error. Please try again — your data is safe.
        </p>
        <Button onClick={reset}>Try again</Button>
      </body>
    </html>
  );
}
