import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the QuickDrop operations team for support with shipments, payments, or courier onboarding.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold md:text-4xl">Contact</h1>
      <p className="mt-3 text-muted-foreground">
        Questions about a shipment, a payment, or becoming a courier? Reach the
        operations team — we monitor every ticket alongside live shipment data.
      </p>
      <div className="mt-8 grid gap-4 rounded-lg border p-6 text-sm">
        <div className="flex justify-between border-b pb-3">
          <span className="font-medium">Support email</span>
          <span className="text-muted-foreground">support@quickdrop.com</span>
        </div>
        <div className="flex justify-between border-b pb-3">
          <span className="font-medium">Operations hotline</span>
          <span className="text-muted-foreground">+880 1700-000000</span>
        </div>
        <div className="flex justify-between border-b pb-3">
          <span className="font-medium">Head office</span>
          <span className="text-muted-foreground">
            House 12, Road 5, Dhanmondi, Dhaka
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Hours</span>
          <span className="text-muted-foreground">
            Sat–Thu, 9:00–18:00 (GMT+6)
          </span>
        </div>
      </div>
    </div>
  );
}
