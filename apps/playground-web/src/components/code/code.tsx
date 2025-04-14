import type { BundledLanguage } from "shiki";
import { RenderCode } from "./RenderCode";
import { getCodeHtml } from "./getCodeHtml";

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
      code={formattedCode}
      html={html}
      className={className}
      scrollableClassName={scrollableClassName}
    />
  );
};
