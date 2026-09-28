import { Footer } from "@/components/layout/public/Footer";
import { Header } from "@/components/layout/public/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
