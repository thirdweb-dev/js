import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadIcon, XIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

export function DropZone(props: {
  isError: boolean;
  onDrop: (acceptedFiles: File[]) => void;
  title: string;
  description: string;
  resetButton:
    | {
        label: string;
        onClick: () => void;
      }
    | undefined;
  className?: string;
  accept: string | undefined;
}) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: props.onDrop,
  });

  const { resetButton } = props;

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-md border border-dashed bg-card py-10 hover:border-active-border",
        props.isError &&
          "border-red-500 bg-red-200/30 text-red-500 hover:border-red-600 dark:border-red-900 dark:bg-red-900/30 dark:hover:border-red-800",
        props.className,
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} accept={props.accept} />
      <div className="flex flex-col items-center justify-center gap-3">
        {!props.isError && (
          <div className="flex flex-col items-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-full border bg-card">
              <UploadIcon className="size-5" />
            </div>
            <h2 className="mb-0.5 text-center font-medium text-lg">
              {props.title}
            </h2>
            <p className="text-center font-medium text-muted-foreground text-sm">
              {props.description}
            </p>
          </div>
        )}

        {props.isError && (
          <div className="flex flex-col items-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-full border border-red-500 bg-red-200/50 text-red-500 dark:border-red-900 dark:bg-red-900/30 dark:text-foreground">
              <XIcon className="size-5" />
            </div>
            <h2 className="mb-0.5 text-center font-medium text-foreground text-lg">
              {props.title}
            </h2>
            <p className="text-balance text-center text-sm">
              {props.description}
            </p>

            {resetButton && (
              <Button
                className="relative z-50 mt-4"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  resetButton.onClick();
                }}
              >
                {resetButton.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
