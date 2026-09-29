"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterValues>,
    defaultValues: { name: "", email: "", password: "", confirm: "" },
    mode: "onTouched",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("Account created — welcome to QuickDrop.");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err, "Registration failed."));
    }
  });

  const e = form.formState.errors;

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
              placeholder="Your name"
              {...form.register("name")}
              aria-invalid={!!e.name}
            />
            {e.name ? (
              <p className="text-xs text-destructive">{e.name.message}</p>
            ) : null}
          </div>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                aria-invalid={!!e.password}
              />
              {e.password ? (
                <p className="text-xs text-destructive">{e.password.message}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                {...form.register("confirm")}
                aria-invalid={!!e.confirm}
              />
              {e.confirm ? (
                <p className="text-xs text-destructive">{e.confirm.message}</p>
              ) : null}
            </div>
          </div>
          <Button type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating account..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
