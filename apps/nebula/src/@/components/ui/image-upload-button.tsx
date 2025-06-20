"use client";

import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

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
        className={props.className}
        onClick={() => fileInputRef.current?.click()}
        variant={props.variant}
      >
        {props.children}
      </Button>
      <input
        accept={props.accept}
        aria-label="Upload image"
        className="hidden"
        multiple={props.multiple}
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
}
