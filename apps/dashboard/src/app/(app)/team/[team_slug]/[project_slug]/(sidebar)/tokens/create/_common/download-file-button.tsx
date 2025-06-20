import { Button } from "@/components/ui/button";
import { ArrowDownToLineIcon } from "lucide-react";

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
}) {
  return (
    <Button
      size="sm"
      className="gap-2"
      onClick={() => {
        handleDownload({
          fileContent: props.fileContent,
          fileNameWithExtension: props.fileNameWithExtension,
          fileFormat: props.fileFormat,
        });
      }}
    >
      <ArrowDownToLineIcon className="size-4" />
      {props.label}
    </Button>
  );
}
