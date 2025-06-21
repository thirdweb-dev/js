"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { BundledLanguage } from "shiki";
import { getCodeHtml } from "./getCodeHtml";
import { PlainTextCodeBlock } from "./plaintext-code";
import { RenderCode } from "./RenderCode";

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
    placeholderData: keepPreviousDataOnCodeChange
      ? keepPreviousData
      : undefined,
    queryFn: () =>
      getCodeHtml(code, lang, {
        ignoreFormattingErrors: ignoreFormattingErrors,
      }),
    queryKey: ["getCodeHtml", code, lang],
    retry: false,
  });

  if (!codeQuery.data) {
    return (
      <PlainTextCodeBlock
        className={className}
        code={code}
        copyButtonClassName={copyButtonClassName}
        onCopy={onCopy}
        scrollableClassName={scrollableClassName}
        scrollableContainerClassName={scrollableContainerClassName}
        shadowColor={shadowColor}
      />
    );
  }

  return (
    <RenderCode
      className={className}
      code={codeQuery.data.formattedCode}
      copyButtonClassName={copyButtonClassName}
      html={codeQuery.data.html}
      onCopy={onCopy}
      scrollableClassName={scrollableClassName}
      scrollableContainerClassName={scrollableContainerClassName}
      shadowColor={shadowColor}
    />
  );
};
