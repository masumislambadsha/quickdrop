import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { LoginForm } from "@/components/form/login-form";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to QuickDrop — or use one-click demo login to explore admin, customer, and courier roles.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="text-center text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Register
        </Link>
      </p>
      <div className="mt-8">
        <Suspense fallback={<AuthLoading />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
