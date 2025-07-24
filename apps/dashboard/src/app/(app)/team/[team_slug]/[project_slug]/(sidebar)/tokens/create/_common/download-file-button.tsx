import { ArrowDownToLineIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function handleDownload(params: {
  fileContent: string;
  fileNameWithExtension: string;
  fileFormat: "text/csv" | "application/json";
}) {
  const link = document.createElement("a");
  const blob = new Blob([params.fileContent], {
    type: params.fileFormat,
  });
  const objectURL = URL.createObjectURL(blob);
  link.href = objectURL;
  link.download = params.fileNameWithExtension;
  link.click();
  URL.revokeObjectURL(objectURL);
}

export function DownloadFileButton(props: {
  fileContent: string;
  fileNameWithExtension: string;
  fileFormat: "text/csv" | "application/json";
  label: string;
  variant?: "default" | "outline";
  className?: string;
  iconClassName?: string;
}) {
  return (
    <Button
      className={cn("gap-2", props.className)}
      variant={props.variant}
      onClick={() => {
        handleDownload({
          fileContent: props.fileContent,
          fileFormat: props.fileFormat,
          fileNameWithExtension: props.fileNameWithExtension,
        });
      }}
      size="sm"
    >
      <ArrowDownToLineIcon className={cn("size-4", props.iconClassName)} />
      {props.label}
    </Button>
  );
}
