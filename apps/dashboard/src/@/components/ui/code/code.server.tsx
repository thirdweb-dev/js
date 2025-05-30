import type { BundledLanguage } from "shiki";
import { RenderCode } from "./RenderCode";
import { getCodeHtml } from "./getCodeHtml";

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
  return <RenderCode code={formattedCode} html={html} className={className} />;
};
