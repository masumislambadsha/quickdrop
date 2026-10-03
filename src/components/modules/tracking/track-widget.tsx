"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TrackWidget() {
  const router = useRouter();
  const [tn, setTn] = useState("");
  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (tn.trim())
          router.push(`/track?tn=${encodeURIComponent(tn.trim())}`);
      }}
    >
      <Input
        placeholder="Enter tracking number (e.g. QD-100001)"
        value={tn}
        onChange={(e) => setTn(e.target.value)}
        aria-label="Tracking number"
        className="min-w-0 flex-1"
      />
      <Button type="submit" className="w-full shrink-0 sm:w-auto">
        Track
      </Button>
    </form>
  );
}
