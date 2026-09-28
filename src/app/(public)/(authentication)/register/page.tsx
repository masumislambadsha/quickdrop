import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/form/register-form";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a QuickDrop customer account to book shipments and track parcels.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="text-center text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Login
        </Link>
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
