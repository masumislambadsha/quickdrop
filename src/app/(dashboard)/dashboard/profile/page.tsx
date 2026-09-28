import type { Metadata } from "next";
import { ProfileForm } from "@/components/form/profile-form";

export const metadata: Metadata = {
  title: "Profile & settings",
  description: "Update your profile and change your password.",
};

export default function CustomerProfilePage() {
  return (
    <div className="mx-auto max-w-xl">
      <ProfileForm />
    </div>
  );
}
