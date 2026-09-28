import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { AdminUsers } from "@/components/modules/admin/users";

export const metadata: Metadata = {
  title: "Manage users",
  description: "View users, change roles, and block or activate accounts.",
};

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AuthLoading label="Loading users..." />}>
      <AdminUsers />
    </Suspense>
  );
}
