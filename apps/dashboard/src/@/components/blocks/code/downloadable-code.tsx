"use client";
import { ArrowDownToLineIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import { handleDownload } from "../download-file-button";

export function DownloadableCode(props: {
  code: string;
  lang: "csv" | "json";
  fileNameWithExtension: string;
}) {
  return (
    <div className="!my-5 bg-card">
      <p className="text-sm text-muted-foreground border border-b-0 px-4 py-3 pr-3.5 rounded-lg rounded-b-none flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <FileTextIcon className="size-3.5" />
          {props.fileNameWithExtension}
        </span>
        <Button
          className="h-auto bg-background p-2"
          onClick={() => {
            handleDownload({
              fileContent: props.code,
              fileFormat:
                props.lang === "csv" ? "text/csv" : "application/json",
              fileNameWithExtension: props.fileNameWithExtension,
            });
          }}
          size="sm"
          variant="outline"
        >
          <ArrowDownToLineIcon className="size-3" />
        </Button>
      </p>
      <div className="relative">
        <CodeClient
          code={props.code}
          lang={props.lang}
          scrollableClassName="max-h-[300px] bg-background bg-card"
          className="rounded-t-none"
        />
      </div>
    </div>
  );
}
