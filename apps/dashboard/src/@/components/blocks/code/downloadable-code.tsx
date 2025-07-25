"use client";
import { ArrowDownToLineIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import { handleDownload } from "../download-file-button";

export function DownloadableCode(props: {
  code: string;
  lang: "csv" | "json";
  fileNameWithExtension: string;
}) {
  return (
    <div className="!my-3 relative">
      <CodeClient
        code={props.code}
        lang={props.lang}
        scrollableClassName="max-h-[300px] bg-background"
      />

      <Button
        className="absolute top-3.5 right-14 mt-[1px] h-auto bg-background p-2"
        onClick={() => {
          handleDownload({
            fileContent: props.code,
            fileFormat: props.lang === "csv" ? "text/csv" : "application/json",
            fileNameWithExtension: props.fileNameWithExtension,
          });
        }}
        size="sm"
        variant="outline"
      >
        <ArrowDownToLineIcon className="size-3" />
      </Button>
    </div>
  );
}
