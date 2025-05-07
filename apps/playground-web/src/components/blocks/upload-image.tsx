"use client";

import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

export function UploadImage(props: {
  onImageUpload?: (file: File) => void;
  className?: string;
  size?: number;
  id?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file type
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Create a preview URL for the image
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Call the callback if provided
    props.onImageUpload?.(file);

    // Clean up the previous preview URL to avoid memory leaks
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className={cn(
        "relative aspect-square w-80 cursor-pointer overflow-hidden rounded-lg border",
        "ring-offset-background transition-colors hover:ring-2 hover:ring-ring hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        props.className,
      )}
      onClick={handleClick}
    >
      <input
        id={props.id}
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Preview"
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-muted-foreground">
          <UploadIcon className="mb-2 h-8 w-8" />
          <p className="text-center text-sm">Upload Image</p>
        </div>
      )}
    </div>
  );
}
