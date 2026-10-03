import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center sm:p-8">
      <p className="text-6xl font-extrabold">404</p>
      <h1 className="text-2xl font-bold">Parcel not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Back to home
      </Link>
    </div>
  );
}
