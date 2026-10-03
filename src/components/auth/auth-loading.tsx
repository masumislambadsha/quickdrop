import { PageLoader } from "@/components/brand/loader";

export default function AuthLoading({
  label = "Loading...",
}: {
  label?: string;
}) {
  return <PageLoader label={label} />;
}
