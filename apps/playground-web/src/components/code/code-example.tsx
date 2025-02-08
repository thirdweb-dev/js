import type { JSX } from "react";
import type { BundledLanguage } from "shiki";
import { ClientOnly } from "../ClientOnly";
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
    <div className="grid grid-cols-1 items-center overflow-hidden rounded-xl border md:grid-cols-2">
      <div className="h-full md:border-r">
        <Code
          code={code}
          lang={lang}
          className="h-full rounded-none border-none"
        />
      </div>
      <div className="relative grid h-full min-h-[300px] place-items-center bg-secondary/10 py-8">
        <ClientOnly ssr={null}>{preview}</ClientOnly>
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
