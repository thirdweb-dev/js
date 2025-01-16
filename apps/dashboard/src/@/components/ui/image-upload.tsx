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
        if (acceptedFiles[0]) {
          setActiveFile(acceptedFiles[0]);
        }
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
            "group relative flex cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md border bg-background p-4 py-6 text-muted-foreground transition-all hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
              <UploadIcon className="h-5 w-5 transition-all group-hover:scale-110" />
              <p className="text-center text-xs">
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
