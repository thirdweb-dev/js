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
    <div className="grid grid-cols-1 md:grid-cols-2 items-center rounded-xl border overflow-hidden">
      <div className="h-full md:border-r">
        <Code
          code={code}
          lang={lang}
          className="border-none h-full rounded-none"
        />
      </div>
      <div className="py-8 h-full grid place-items-center bg-secondary/10 relative min-h-[300px]">
        {preview}
        <BackgroundPattern />
      </div>
    </div>
  );
};

function BackgroundPattern() {
  const color = "hsl(var(--foreground)/10%)";
  return (
    <div
      className="absolute inset-0 z-[-1]"
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 60%)",
      }}
    />
  );
}
