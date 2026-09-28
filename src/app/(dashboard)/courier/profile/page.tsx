import type { Metadata } from "next";
import { ProfileForm } from "@/components/form/profile-form";

export const metadata: Metadata = {
  title: "Courier profile",
  description: "Update your courier profile and password.",
};

export default function CourierProfilePage() {
  return (
    <div className="mx-auto max-w-xl">
      <ProfileForm />
    </div>
  );
}
