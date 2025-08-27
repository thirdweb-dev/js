import type { BundledLanguage } from "shiki";
import { getCodeHtml } from "./getCodeHtml";
import { RenderCode } from "./RenderCode";

export type CodeProps = {
  code: string;
  lang: BundledLanguage;
  className?: string;
  ignoreFormattingErrors?: boolean;
};

export const CodeServer: React.FC<CodeProps> = async ({
  code,
  lang,
  className,
  ignoreFormattingErrors,
}) => {
  const { html, formattedCode } = await getCodeHtml(code, lang, {
    ignoreFormattingErrors,
  });
  return <RenderCode className={className} code={formattedCode} html={html} />;
};
