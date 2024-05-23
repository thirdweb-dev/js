import type { BundledLanguage } from "shiki";
import { Code } from "./code";

export type CodeExampleProps = {
  preview: JSX.Element;
  code: string;
  lang: BundledLanguage;
};

export const CodeExample: React.FC<CodeExampleProps> = ({
  code,
  lang,
  preview,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center rounded-3xl overflow-hidden shadow-lg border border-accent-foreground/10">
      <div className="h-full max-sm:border-b md:border-r border-accent-foreground/10">
        <Code code={code} lang={lang} />
      </div>
      <div className="py-8 h-full grid place-items-center backdrop-blur-md bg-accent/30">
        {preview}
      </div>
    </div>
  );
};
