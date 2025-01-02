"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { BundledLanguage } from "shiki";
import { RenderCode } from "./RenderCode";
import { getCodeHtml } from "./getCodeHtml";
import { PlainTextCodeBlock } from "./plaintext-code";

export type CodeProps = {
  code: string;
  lang: BundledLanguage;
  className?: string;
  scrollableClassName?: string;
  keepPreviousDataOnCodeChange?: boolean;
  copyButtonClassName?: string;
  scrollableContainerClassName?: string;
  shadowColor?: string;
  ignoreFormattingErrors?: boolean;
  onCopy?: (code: string) => void;
};

export const CodeClient: React.FC<CodeProps> = ({
  code,
  lang,
  className,
  scrollableClassName,
  keepPreviousDataOnCodeChange = false,
  copyButtonClassName,
  ignoreFormattingErrors,
  scrollableContainerClassName,
  shadowColor,
  onCopy,
}) => {
  const codeQuery = useQuery({
    queryKey: ["html", code],
    queryFn: () =>
      getCodeHtml(code, lang, {
        ignoreFormattingErrors: ignoreFormattingErrors,
      }),
    placeholderData: keepPreviousDataOnCodeChange
      ? keepPreviousData
      : undefined,
    retry: false,
  });

  if (!codeQuery.data) {
    return (
      <PlainTextCodeBlock
        code={code}
        className={className}
        scrollableClassName={scrollableClassName}
        copyButtonClassName={copyButtonClassName}
        scrollableContainerClassName={scrollableContainerClassName}
        shadowColor={shadowColor}
        onCopy={onCopy}
      />
    );
  }

  return (
    <RenderCode
      code={codeQuery.data.formattedCode}
      html={codeQuery.data.html}
      className={className}
      scrollableClassName={scrollableClassName}
      copyButtonClassName={copyButtonClassName}
      scrollableContainerClassName={scrollableContainerClassName}
      shadowColor={shadowColor}
      onCopy={onCopy}
    />
  );
};
