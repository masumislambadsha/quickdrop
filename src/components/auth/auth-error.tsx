import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shown when the profile request failed while auth tokens are still present,
 * i.e. a transient problem (offline, backend unreachable) rather than an
 * expired session. Redirecting to /login in this state would be wrong, so we
 * offer a retry instead.
 */
export default function AuthError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <WifiOff className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Connection problem</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        We could not reach the server to load your account. You are still signed
        in — check your connection and try again.
      </p>
      <Button type="button" onClick={onRetry} variant="outline">
        <RefreshCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
