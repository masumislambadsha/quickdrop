"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks";
import { demoLogin } from "@/hooks/auth.hook";
import { getErrorMessage } from "@/lib/apiClient";
import { useAuthStore } from "@/store/auth.store";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function roleHome(role: string): string {
  if (role === "ADMIN") return "/admin";
  if (role === "COURIER") return "/courier";
  return "/dashboard";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [demoRole, setDemoRole] = useState<string | null>(null);

  const afterLogin = (role: string) => {
    queryClient.invalidateQueries({ queryKey: ["me"] });
    router.replace(searchParams.get("next") ?? roleHome(role));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === "email") fieldErrors.email = issue.message;
        if (issue.path[0] === "password") fieldErrors.password = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    try {
      const res = await mutateAsync(parsed.data);
      toast.success("Logged in successfully.");
      afterLogin(res.data.user.role);
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed."));
    }
  };

  const onDemoLogin = async (role: "ADMIN" | "CUSTOMER" | "COURIER") => {
    setDemoRole(role);
    try {
      const res = await demoLogin(role);
      useAuthStore
        .getState()
        .setTokens(res.data.accessToken, res.data.refreshToken);
      toast.success(`Logged in as ${role.toLowerCase()}.`);
      afterLogin(res.data.user.role);
    } catch (err) {
      toast.error(getErrorMessage(err, "Demo login failed."));
    } finally {
      setDemoRole(null);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4" noValidate>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email ? (
                <p className="text-xs text-destructive">{errors.email}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
              />
              {errors.password ? (
                <p className="text-xs text-destructive">{errors.password}</p>
              ) : null}
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> OR{" "}
        <span className="h-px flex-1 bg-border" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick demo login</CardTitle>
          <CardDescription>
            One click to explore each role — no typing needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            {
              role: "ADMIN" as const,
              icon: "Admin",
              email: "admin@quickdrop.com",
            },
            {
              role: "CUSTOMER" as const,
              icon: "Customer",
              email: "customer@quickdrop.com",
            },
            {
              role: "COURIER" as const,
              icon: "Courier",
              email: "courier@quickdrop.com",
            },
          ].map((d) => (
            <div key={d.role} className="rounded-lg border p-4 text-center">
              <p className="font-semibold">{d.icon}</p>
              <p className="mt-1 break-all text-xs text-muted-foreground">
                {d.email}
              </p>
              <Button
                className="mt-3 w-full"
                variant="outline"
                disabled={demoRole !== null}
                onClick={() => onDemoLogin(d.role)}
              >
                {demoRole === d.role ? "Logging in..." : "Demo login"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
