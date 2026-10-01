"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { useChangePassword, useGetMe, useUpdateMe } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50)
    .optional()
    .or(z.literal("")),
  contactNumber: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(50).optional().or(z.literal("")),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(100),
    confirm: z.string().min(1, "Please confirm the new password"),
  })
  .refine((v) => v.newPassword === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export function ProfileForm() {
  const { data, isPending } = useGetMe();
  const updateMutation = useUpdateMe();
  const passwordMutation = useChangePassword();

  const profile = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", contactNumber: "", address: "", city: "" },
  });
  const password = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirm: "" },
  });

  useEffect(() => {
    const user = data?.data;
    if (user) {
      profile.reset({
        name: user.name ?? "",
        contactNumber:
          user.customer?.contactNumber ?? user.courier?.contactNumber ?? "",
        address: user.customer?.address ?? "",
        city: user.customer?.city ?? user.courier?.currentCity ?? "",
      });
    }
  }, [data, profile]);

  if (isPending)
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  const user = data?.data;
  if (!user)
    return <p className="text-sm text-destructive">Could not load profile.</p>;

  const onProfile = profile.handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync({
        name: values.name || undefined,
        contactNumber: values.contactNumber || undefined,
        address: values.address || undefined,
        city: values.city || undefined,
      });
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update profile."));
    }
  });

  const onPassword = password.handleSubmit(async (values) => {
    try {
      await passwordMutation.mutateAsync({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed.");
      password.reset();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change password."));
    }
  });

  const pe = profile.formState.errors;
  const we = password.formState.errors;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            {user.email} · {user.role}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onProfile} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Full name</Label>
              <Input {...profile.register("name")} />
              {pe.name ? (
                <p className="text-xs text-destructive">{pe.name.message}</p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Contact number</Label>
                <Input {...profile.register("contactNumber")} />
              </div>
              <div className="grid gap-1.5">
                <Label>City</Label>
                <Input {...profile.register("city")} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Address</Label>
              <Input {...profile.register("address")} />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onPassword} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Old password</Label>
              <PasswordInput {...password.register("oldPassword")} />
              {we.oldPassword ? (
                <p className="text-xs text-destructive">
                  {we.oldPassword.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>New password</Label>
                <PasswordInput {...password.register("newPassword")} />
                {we.newPassword ? (
                  <p className="text-xs text-destructive">
                    {we.newPassword.message}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-1.5">
                <Label>Confirm new password</Label>
                <PasswordInput {...password.register("confirm")} />
                {we.confirm ? (
                  <p className="text-xs text-destructive">
                    {we.confirm.message}
                  </p>
                ) : null}
              </div>
            </div>
            <Button
              type="submit"
              variant="outline"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? "Changing..." : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
