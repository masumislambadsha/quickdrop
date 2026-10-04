import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const display = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["900"],
  style: ["italic", "normal"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "QuickDrop — Courier & Logistics Platform",
    template: "%s | QuickDrop",
  },
  description:
    "Book shipments, track parcels in real time, and pay securely. Courier, customer, and admin workflows in one platform.",
  openGraph: {
    type: "website",
    siteName: "QuickDrop",
    title: "QuickDrop — Courier & Logistics Platform",
    description:
      "Book shipments in minutes, track every parcel milestone, and pay securely with Stripe. Built for customers, couriers, and operations teams.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickDrop — Courier & Logistics Platform",
    description:
      "Courier, customer, and admin workflows in one platform. Real-time tracking and Stripe payments.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
