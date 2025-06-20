import type { BundledLanguage } from "shiki";
import { getCodeHtml } from "./getCodeHtml";
import { RenderCode } from "./RenderCode";

type CodeProps = {
  code: string;
  lang: BundledLanguage;
  className?: string;
  scrollableClassName?: string;
};

export const Code: React.FC<CodeProps> = async ({
  code,
  lang,
  className,
  scrollableClassName,
}) => {
  const { html, formattedCode } = await getCodeHtml(code, lang);
  return (
    <RenderCode
      className={className}
      code={formattedCode}
      html={html}
      scrollableClassName={scrollableClassName}
    />
  );
};
