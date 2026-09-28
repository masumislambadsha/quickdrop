"use client";

import { useRouter } from "next/navigation";
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
import { useRegister } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50),
    email: z.string().trim().email("Enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export function RegisterForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useRegister();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues)
        fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    try {
      await mutateAsync({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });
      toast.success("Account created — welcome to QuickDrop.");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err, "Registration failed."));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a customer account</CardTitle>
        <CardDescription>
          Register with email and password. New accounts start as customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={set("name")}
              placeholder="Your name"
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name}</p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={set("password")}
              />
              {errors.password ? (
                <p className="text-xs text-destructive">{errors.password}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={form.confirm}
                onChange={set("confirm")}
              />
              {errors.confirm ? (
                <p className="text-xs text-destructive">{errors.confirm}</p>
              ) : null}
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating account..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
