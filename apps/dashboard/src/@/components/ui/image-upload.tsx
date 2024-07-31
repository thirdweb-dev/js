"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

export interface ImageUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onUpload?: (files: File[]) => void;
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ className, onUpload, ...props }, ref) => {
    const [activeFile, setActiveFile] = React.useState<File | null>(null);
    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        setActiveFile(acceptedFiles[0]);
        onUpload?.(acceptedFiles);
      },
      [onUpload],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    return (
      <div className="flex items-start">
        <div
          {...getRootProps()}
          className={cn(
            "border bg-card relative group cursor-pointer hover:border-primary flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden transition-all rounded-md flex items-center justify-center p-4 py-6 text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            isDragActive ? "border-primary" : "border-input",
            !activeFile ? "w-full" : "min-h-32 min-w-32",
            className,
          )}
        >
          <input ref={ref} {...getInputProps()} {...props} />
          {activeFile ? (
            <Image
              className="object-contain object-center "
              src={URL.createObjectURL(activeFile)}
              fill
              alt=""
            />
          ) : (
            <>
              <UploadIcon className="w-5 h-5 transition-all group-hover:scale-110" />
              <p className="text-xs text-center">
                Drag and drop a file or click to upload
              </p>
            </>
          )}
        </div>
      </div>
    );
  },
);
ImageUpload.displayName = "Input";

export { ImageUpload };
