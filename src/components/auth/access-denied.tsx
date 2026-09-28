import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <ShieldAlert className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-bold">Access denied</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your account does not have permission to view this page. Please log in
        with the correct role.
      </p>
      <Link
        href="/login"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Go to login
      </Link>
    </div>
  );
}
