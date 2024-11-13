import type { BundledLanguage } from "shiki";
import { RenderCode } from "./RenderCode";
import { getCodeHtml } from "./getCodeHtml";

export type CodeProps = {
  code: string;
  lang: BundledLanguage;
  className?: string;
};

export const CodeServer: React.FC<CodeProps> = async ({
  code,
  lang,
  className,
}) => {
  const { html, formattedCode } = await getCodeHtml(code, lang);
  return <RenderCode code={formattedCode} html={html} className={className} />;
};
