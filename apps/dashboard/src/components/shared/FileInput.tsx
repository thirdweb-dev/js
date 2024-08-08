/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AiFillEye } from "@react-icons/all-files/ai/AiFillEye";
import { AiOutlineFileAdd } from "@react-icons/all-files/ai/AiOutlineFileAdd";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import Link from "next/link";
import { useCallback } from "react";
import {
  type Accept,
  type DropEvent,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import { FiImage, FiUpload } from "react-icons/fi";

interface IFileInputProps {
  accept?: Accept;
  setValue: (file: File) => void;
  isDisabled?: boolean;
  value?: string | File;
  showUploadButton?: true;
  previewMaxWidth?: string;
  renderPreview?: (fileUrl: string) => React.ReactNode;
  helperText?: string;
  selectOrUpload?: "Select" | "Upload";
  isDisabledText?: string;
  showPreview?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const FileInput: React.FC<IFileInputProps> = ({
  setValue,
  isDisabled,
  accept,
  showUploadButton,
  value,
  children,
  renderPreview,
  helperText,
  selectOrUpload = "Select",
  isDisabledText = "Upload Disabled",
  showPreview = true,
  className,
  previewMaxWidth,
}) => {
  const onDrop = useCallback<
    <T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent,
    ) => void
  >(
    (droppedFiles) => {
      if (droppedFiles?.[0]) {
        setValue(droppedFiles[0]);
      }
    },
    [setValue],
  );
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept,
  });

  const file: File | null =
    typeof window !== "undefined" && value instanceof File ? value : null;
  const fileUrl = useImageFileOrUrl(value);

  const helperTextOrFile = helperText
    ? helperText
    : accept &&
        Object.keys(accept).filter((k) => k.split("/")[0] !== "image")
          .length === 1
      ? "image"
      : "file";

  // Don't display non image file types
  const noDisplay = file && !file.type.includes("image");

  const fileType = file
    ? file.type.includes("image")
      ? "Image"
      : file.type.includes("audio")
        ? "Audio"
        : file.type.includes("video")
          ? "Video"
          : file.type.includes("csv")
            ? "CSV"
            : file.type.includes("text") || file.type.includes("pdf")
              ? "Text"
              : file.type.includes("model") ||
                  file.name.endsWith(".glb") ||
                  file.name.endsWith(".usdz") ||
                  file.name.endsWith(".obj")
                ? "3D Model"
                : "Media"
    : null;

  if (children) {
    return (
      <div className={cn("cursor-pointer", className)} {...getRootProps()}>
        {children}
        <input {...getInputProps()} />
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center" {...getRootProps()}>
      <input {...getInputProps()} />
      {showPreview && (
        <>
          {isDisabled ? (
            <div
              style={{
                aspectRatio: 1,
                maxWidth: previewMaxWidth,
              }}
              className={cn(
                "opacity-50 cursor-not-allowed bg-muted",
                "w-full flex items-center justify-center hover:bg-accent border border-border hover:ring-2 hover:ring-ring",
                className,
              )}
            >
              <div className="flex flex-col items-center text-secondary-foreground gap-2">
                <FiUpload className="size-6" />
                <p className="text-sm text-center">{isDisabledText}</p>
              </div>
            </div>
          ) : (
            <div
              style={{
                aspectRatio: 1,
                maxWidth: previewMaxWidth,
              }}
              className={cn(
                "cursor-pointer relative overflow-hidden",
                "w-full flex items-center justify-center hover:bg-accent border border-border hover:ring-2 hover:ring-ring",
                fileUrl ? "bg-transparent" : "bg-muted",
                className,
              )}
            >
              {noDisplay ? (
                <div className="flex flex-col items-center text-secondary-foreground gap-2">
                  <FiImage className="size-6" />
                  <p className="text-sm">{fileType} uploaded</p>
                </div>
              ) : fileUrl ? (
                renderPreview ? (
                  renderPreview(fileUrl)
                ) : (
                  <img
                    alt=""
                    className="top-0 left-0 absolute w-full h-full object-contain"
                    src={fileUrl}
                  />
                )
              ) : (
                <div className="flex flex-col items-center text-secondary-foreground gap-2.5">
                  <div className="p-3 bg-background rounded-full flex items-center justify-center border border-border">
                    <FiUpload className="size-5" />
                  </div>
                  <p className="text-sm text-center">
                    Upload {helperTextOrFile}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showUploadButton || noDisplay ? (
        <div className="flex flex-col">
          {showUploadButton && (
            <Button
              onClick={open}
              variant="outline"
              disabled={isDisabled}
              className="gap-2"
            >
              <AiOutlineFileAdd className="size-4" />
              {selectOrUpload} {helperTextOrFile}
            </Button>
          )}
          {noDisplay && (
            <Link href={fileUrl} target="_blank" className="no-underline">
              <Button variant="outline" className="gap-2">
                <AiFillEye className="size-4" />
                View File
              </Button>
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
};
