import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "../../lib/utils";

export function ExportToCSVButton(props: {
  getData: () => Promise<{ header: string[]; rows: string[][] } | string>;
  fileName: string;
  disabled?: boolean;
  className?: string;
}) {
  const exportMutation = useMutation({
    mutationFn: async () => {
      const data = await props.getData();
      if (typeof data === "string") {
        exportToCSV(props.fileName, data);
      } else {
        const fileContent = convertToCSVFormat(data);
        exportToCSV(props.fileName, fileContent);
      }
    },
    onError: () => {
      toast.error("Failed to download CSV");
    },
    onSuccess: () => {
      toast("Exported Successfully", {
        description: "CSV file has been downloaded",
      });
    },
  });

  return (
    <Button
      className={cn("flex items-center gap-2 border text-xs", props.className)}
      disabled={props.disabled || exportMutation.isPending}
      onClick={async () => {
        exportMutation.mutate();
      }}
      variant="outline"
    >
      {exportMutation.isPending ? (
        <>
          Downloading
          <Spinner className="size-3" />
        </>
      ) : (
        <>
          <DownloadIcon className="size-3" />
          Export as CSV
        </>
      )}
    </Button>
  );
}

function convertToCSVFormat(data: { header: string[]; rows: string[][] }) {
  return Papa.unparse({
    data: data.rows,
    fields: data.header,
  });
}

function exportToCSV(fileName: string, fileContent: string) {
  const csvContent = `data:text/csv;charset=utf-8,${fileContent}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
}
