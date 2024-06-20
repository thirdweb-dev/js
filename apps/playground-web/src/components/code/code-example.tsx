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
    <div className="grid grid-cols-1 md:grid-cols-2 items-center rounded-3xl shadow-lg">
      <div className="h-full border border-accent-foreground/10 border-b-0 md:border-b md:border-r-0 rounded-3xl md:rounded-r-none md:rounded-b-none">
        <Code code={code} lang={lang} />
      </div>
      <div className="py-8 h-full grid place-items-center backdrop-blur-md bg-accent/30 max-md:rounded-b-3xl md:rounded-b-none md:rounded-r-3xl border border-accent-foreground/10">
        {preview}
      </div>
    </div>
  );
};
