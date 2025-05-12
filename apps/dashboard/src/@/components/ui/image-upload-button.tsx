"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { useRef } from "react";

interface ImageUploadProps {
  value: File | undefined;
  onChange?: (files: File[]) => void;
  children?: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
  multiple?: boolean;
  accept: string;
}

export function ImageUploadButton(props: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    props.onChange?.(files);
  };

  return (
    <div>
      <Button
        variant={props.variant}
        onClick={() => fileInputRef.current?.click()}
        className={props.className}
      >
        {props.children}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple={props.multiple}
        accept={props.accept}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload image"
      />
    </div>
  );
}
