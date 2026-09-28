import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { CourierTasks } from "@/components/modules/courier/tasks";

export const metadata: Metadata = {
  title: "My tasks",
  description:
    "Courier delivery queue — assigned jobs, status updates, and confirmations.",
};

export default function CourierTasksPage() {
  return (
    <Suspense fallback={<AuthLoading label="Loading tasks..." />}>
      <CourierTasks />
    </Suspense>
  );
}
