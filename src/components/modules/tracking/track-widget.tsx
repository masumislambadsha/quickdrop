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
      className="flex gap-2"
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
      />
      <Button type="submit">Track</Button>
    </form>
  );
}
