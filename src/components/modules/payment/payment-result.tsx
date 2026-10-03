"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function PaymentResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";

  return (
    <div className="flex w-full min-w-0 flex-col items-center text-center">
      <CheckCircle2 className="h-12 w-12 shrink-0 text-emerald-600" />
      <h1 className="mt-4 break-words text-2xl font-bold">
        Payment successful
      </h1>
      <p className="mt-2 w-full max-w-md text-sm break-words text-balance text-muted-foreground">
        Stripe confirmed your payment. The backend webhook marks the shipment as
        paid automatically — it will appear in your payment history shortly.
      </p>
      {sessionId ? (
        <p className="mt-3 w-full max-w-full overflow-x-auto break-all rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
          Session: {sessionId}
        </p>
      ) : null}
    </div>
  );
}
