import type { Metadata } from "next";
import { ProfileForm } from "@/components/form/profile-form";

export const metadata: Metadata = {
  title: "Admin profile",
  description: "Update your admin profile and password.",
};

export default function AdminProfilePage() {
  return (
    <div className="mx-auto max-w-xl">
      <ProfileForm />
    </div>
  );
}
