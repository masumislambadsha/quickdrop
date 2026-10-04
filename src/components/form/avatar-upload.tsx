"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadAvatar } from "@/lib/cloudinary";

export function AvatarUpload({
  currentUrl,
  onUploaded,
}: {
  currentUrl?: string | null;
  onUploaded: (url: string, publicId: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = () => inputRef.current?.click();

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const local = URL.createObjectURL(file);
    setPreview(local);
    setBusy(true);
    setProgress(0);
    try {
      const res = await uploadAvatar(file, setProgress);
      setPreview(res.secureUrl);
      onUploaded(res.secureUrl, res.publicId);
      toast.success("Avatar uploaded. Save to keep it.");
    } catch (err) {
      setPreview(currentUrl ?? null);
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border bg-muted">
        {preview ? (
          <Image
            src={preview}
            alt="Profile avatar"
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
            {(currentUrl ?? "Q").slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="grid gap-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <Button type="button" variant="outline" onClick={pick} disabled={busy}>
          {busy ? "Uploading..." : "Upload avatar"}
        </Button>
        {progress !== null ? (
          <div
            className="h-1.5 w-40 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            PNG/JPG up to 5MB, via Cloudinary.
          </p>
        )}
      </div>
    </div>
  );
}
