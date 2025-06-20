import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilePreview } from "@app/team/[team_slug]/[project_slug]/(sidebar)/tokens/create/_common/file-preview";
import { FilePlusIcon, UploadIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import {
  type Accept,
  type DropEvent,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import type { ThirdwebClient } from "thirdweb";

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
    onDrop,
    accept,
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
            style={{
              aspectRatio: 1,
              maxWidth: previewMaxWidth,
            }}
            className={cn(
              "cursor-not-allowed bg-card opacity-50",
              "flex w-full items-center justify-center border border-border hover:bg-accent hover:ring-2 hover:ring-ring",
              className,
            )}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadIcon className="size-6" />
              <p className="text-center text-sm">{isDisabledText}</p>
            </div>
          </div>
        ) : (
          <div
            style={{
              aspectRatio: 1,
              maxWidth: previewMaxWidth,
            }}
            className={cn(
              "relative cursor-pointer overflow-hidden",
              "flex w-full items-center justify-center border border-border hover:bg-accent hover:ring-2 hover:ring-ring",
              value ? "bg-transparent" : "bg-card",
              className,
            )}
          >
            {value ? (
              <FilePreview
                srcOrFile={value}
                client={client}
                className="h-full w-full"
                imgContainerClassName="h-full w-full"
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
            <Button variant="outline" disabled={isDisabled} className="gap-2">
              <FilePlusIcon className="size-4" /> {selectOrUpload}{" "}
              {helperTextOrFile}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
};
