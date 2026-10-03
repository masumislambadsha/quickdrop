import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the QuickDrop operations team for support with shipments, payments, or courier onboarding.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Contact</h1>
      <p className="mt-3 text-muted-foreground">
        Questions about a shipment, a payment, or becoming a courier? Reach the
        operations team — we monitor every ticket alongside live shipment data.
      </p>
      <div className="mt-8 grid gap-4 rounded-lg border p-4 text-sm sm:p-6">
        <div className="flex flex-col gap-1 border-b pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="shrink-0 font-medium">Support email</span>
          <span className="break-words text-muted-foreground sm:text-right">
            support@quickdrop.com
          </span>
        </div>
        <div className="flex flex-col gap-1 border-b pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="shrink-0 font-medium">Operations hotline</span>
          <span className="break-words text-muted-foreground sm:text-right">
            +880 1700-000000
          </span>
        </div>
        <div className="flex flex-col gap-1 border-b pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="shrink-0 font-medium">Head office</span>
          <span className="break-words text-muted-foreground sm:text-right">
            House 12, Road 5, Dhanmondi, Dhaka
          </span>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="shrink-0 font-medium">Hours</span>
          <span className="break-words text-muted-foreground sm:text-right">
            Sat–Thu, 9:00–18:00 (GMT+6)
          </span>
        </div>
      </div>
    </div>
  );
}
