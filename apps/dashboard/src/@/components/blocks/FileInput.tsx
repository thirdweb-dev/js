import { FilePlusIcon, UploadIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import {
  type Accept,
  type DropEvent,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import type { ThirdwebClient } from "thirdweb";
import { FilePreview } from "@/components/blocks/file-preview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  disableHelperText?: boolean;
  client: ThirdwebClient;
}

export const FileInput: React.FC<IFileInputProps> = ({
  setValue,
  isDisabled,
  accept,
  showUploadButton,
  value,
  children,
  helperText,
  selectOrUpload = "Select",
  isDisabledText = "Upload Disabled",
  showPreview = true,
  className,
  previewMaxWidth,
  client,
  disableHelperText,
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
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    onDrop,
  });

  const helperTextOrFile = helperText
    ? helperText
    : accept &&
        Object.keys(accept).filter((k) => k.split("/")[0] !== "image")
          .length === 1
      ? "image"
      : "file";

  const createdBlobUrl = useRef<string | null>(null);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    return () => {
      if (createdBlobUrl.current) {
        URL.revokeObjectURL(createdBlobUrl.current);
      }
    };
  }, []);

  if (children) {
    return (
      <div className={cn("cursor-pointer", className)} {...getRootProps()}>
        {children}
        <input {...getInputProps()} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4" {...getRootProps()}>
      <input {...getInputProps()} />
      {showPreview &&
        (isDisabled ? (
          <div
            className={cn(
              "cursor-not-allowed bg-card opacity-50",
              "flex w-full items-center justify-center border border-border hover:bg-accent hover:ring-2 hover:ring-ring",
              className,
            )}
            style={{
              aspectRatio: 1,
              maxWidth: previewMaxWidth,
            }}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadIcon className="size-6" />
              <p className="text-center text-sm">{isDisabledText}</p>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "relative cursor-pointer overflow-hidden",
              "flex w-full items-center justify-center border border-border hover:bg-accent hover:ring-2 hover:ring-ring",
              value ? "bg-transparent" : "bg-card",
              className,
            )}
            style={{
              aspectRatio: 1,
              maxWidth: previewMaxWidth,
            }}
          >
            {value ? (
              <FilePreview
                className="h-full w-full"
                client={client}
                imgContainerClassName="h-full w-full"
                srcOrFile={value}
              />
            ) : (
              <div className="flex flex-col items-center gap-2.5 text-muted-foreground">
                <div className="flex items-center justify-center rounded-full border border-border bg-background p-3">
                  <UploadIcon className="size-5" />
                </div>
                {!disableHelperText && (
                  <p className="text-center text-sm">
                    Upload {helperTextOrFile}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

      {showUploadButton ? (
        <div className="flex flex-col gap-2">
          {showUploadButton && (
            <Button className="gap-2" disabled={isDisabled} variant="outline">
              <FilePlusIcon className="size-4" /> {selectOrUpload}{" "}
              {helperTextOrFile}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
};
