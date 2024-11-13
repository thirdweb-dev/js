"use client";

import { cn } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { BundledLanguage } from "shiki";
import { Spinner } from "../../ui/Spinner/Spinner";
import { RenderCode } from "./RenderCode";
import { getCodeHtml } from "./getCodeHtml";

export type CodeProps = {
  code: string;
  lang: BundledLanguage;
  className?: string;
  scrollableClassName?: string;
  loadingClassName?: string;
  keepPreviousDataOnCodeChange?: boolean;
};

export const CodeClient: React.FC<CodeProps> = ({
  code,
  lang,
  className,
  scrollableClassName,
  loadingClassName,
  keepPreviousDataOnCodeChange = false,
}) => {
  const codeQuery = useQuery({
    queryKey: ["html", code],
    queryFn: () => getCodeHtml(code, lang),
    placeholderData: keepPreviousDataOnCodeChange
      ? keepPreviousData
      : undefined,
    retry: false,
  });

  if (!codeQuery.data) {
    return (
      <div
        className={cn(
          "flex min-h-[200px] items-center justify-center rounded-lg border border-border",
          loadingClassName,
        )}
      >
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <RenderCode
      code={codeQuery.data.formattedCode}
      html={codeQuery.data.html}
      className={className}
      scrollableClassName={scrollableClassName}
    />
  );
};
