"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin } from "@/hooks";
import { demoLogin, seedMeCache } from "@/hooks/auth.hook";
import { getErrorMessage } from "@/lib/apiClient";
import { useAuthStore } from "@/store/auth.store";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

function roleHome(role: string): string {
  if (role === "ADMIN") return "/admin";
  if (role === "COURIER") return "/courier";
  return "/dashboard";
}

function canAccess(role: string, next: string): boolean {
  if (next === "/admin" || next.startsWith("/admin/")) return role === "ADMIN";
  if (next === "/courier" || next.startsWith("/courier/"))
    return role === "COURIER";
  if (next === "/dashboard" || next.startsWith("/dashboard/"))
    return role === "CUSTOMER";
  return false;
}

function safeNext(role: string, next: string | null): string {
  if (next && canAccess(role, next)) return next;
  return roleHome(role);
}

const DEMOS = [
  { role: "ADMIN" as const, label: "Admin", email: "admin@quickdrop.com" },
  {
    role: "CUSTOMER" as const,
    label: "Customer",
    email: "customer@quickdrop.com",
  },
  {
    role: "COURIER" as const,
    label: "Courier",
    email: "courier@quickdrop.com",
  },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const [demoRole, setDemoRole] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema) as Resolver<LoginValues>,
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const afterLogin = (role: string) => {
    queryClient.invalidateQueries({ queryKey: ["me"] });
    router.replace(safeNext(role, searchParams.get("next")));
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const res = await loginMutation.mutateAsync(values);
      toast.success("Logged in successfully.");
      afterLogin(res.data.user.role);
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed."));
    }
  });

  const onDemoLogin = async (role: "ADMIN" | "CUSTOMER" | "COURIER") => {
    setDemoRole(role);
    try {
      const res = await demoLogin(role);
      useAuthStore
        .getState()
        .setTokens(res.data.accessToken, res.data.refreshToken);
      seedMeCache(queryClient, res.data.user);
      toast.success(`Logged in as ${role.toLowerCase()}.`);
      afterLogin(res.data.user.role);
    } catch (err) {
      toast.error(getErrorMessage(err, "Demo login failed."));
    } finally {
      setDemoRole(null);
    }
  };

  const e = form.formState.errors;

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
                {...form.register("email")}
                aria-invalid={!!e.email}
              />
              {e.email ? (
                <p className="text-xs text-destructive">{e.email.message}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                {...form.register("password")}
                aria-invalid={!!e.password}
              />
              {e.password ? (
                <p className="text-xs text-destructive">{e.password.message}</p>
              ) : null}
            </div>
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
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
          {DEMOS.map((d) => (
            <div key={d.role} className="rounded-lg border p-4 text-center">
              <p className="font-semibold">{d.label}</p>
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
