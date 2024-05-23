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
    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
      <div className="h-full shadow-lg">
        <Code code={code} lang={lang} />
      </div>
      <div className="border border-border/30 p-12 mx-8 md:mx-0 md:h-[80%] rounded-bl-md rounded-br-md md:rounded-bl-none md:rounded-tr-md grid place-items-center backdrop-blur-lg bg-accent/30 shadow-lg">
        {preview}
      </div>
    </div>
  );
};
