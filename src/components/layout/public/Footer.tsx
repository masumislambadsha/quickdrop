export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row">
        <p>
          © {new Date().getFullYear()} QuickDrop — Courier & Logistics Platform
        </p>
        <p>Built with Next.js · Secure Stripe payments · Real-time tracking</p>
      </div>
    </footer>
  );
}
