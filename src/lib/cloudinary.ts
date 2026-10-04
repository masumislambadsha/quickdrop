export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

/**
 * Unsigned Cloudinary upload with progress (B7A7 file-upload requirement).
 * Configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.
 */
export function uploadAvatar(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<CloudinaryUploadResult> {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim().replace(
      /^["']|["']$/g,
      "",
    );
  const preset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim().replace(
      /^["']|["']$/g,
      "",
    );
  // Public API key (not secret) — this product environment requires api_key
  // even for unsigned uploads, verified via direct API test.
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim().replace(
    /^["']|["']$/g,
    "",
  );

  if (!cloudName || !preset || !apiKey) {
    // NEXT_PUBLIC_ vars are baked at dev-server start / build time —
    // a stale `next dev` after editing .env.local will still see the old values.
    return Promise.reject(
      new Error(
        "Avatar upload is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local (then restart `npm run dev`), and in Vercel env (then redeploy).",
      ),
    );
  }

  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Please choose an image file."));
  }
  if (file.size > 5 * 1024 * 1024) {
    return Promise.reject(new Error("Image must be under 5MB."));
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);
    form.append("api_key", apiKey);
    // Note: do NOT send `folder` here — set Folder: quickdrop/avatars inside
    // the unsigned preset itself.

    xhr.upload.addEventListener("progress", (ev) => {
      if (ev.lengthComputable)
        onProgress?.(Math.round((ev.loaded / ev.total) * 100));
    });
    xhr.addEventListener("load", () => {
      try {
        const res = JSON.parse(xhr.responseText) as {
          secure_url?: string;
          public_id?: string;
          error?: { message?: string };
        };
        if (xhr.status >= 200 && xhr.status < 300 && res.secure_url) {
          resolve({ secureUrl: res.secure_url, publicId: res.public_id ?? "" });
        } else {
          reject(new Error(res.error?.message ?? "Upload failed."));
        }
      } catch {
        reject(new Error("Upload failed."));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Upload failed.")));
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    );
    xhr.send(form);
  });
}
