import { Code2Icon, EyeIcon } from "lucide-react";
import type { JSX } from "react";
import type { BundledLanguage } from "shiki";
import { ClientOnly } from "../ClientOnly";
import { Code } from "./code";

type CodeExampleProps = {
  preview: JSX.Element;
  code: string;
  lang: BundledLanguage;
  header?: {
    title: React.ReactNode;
    description?: React.ReactNode;
  };
};

export const CodeExample: React.FC<CodeExampleProps> = ({
  code,
  lang,
  preview,
  header,
}) => {
  return (
    <div className="relative z-0">
      {header && (
        <div className="mb-4">
          <h2 className="font-semibold text-xl tracking-tight capitalize">
            {header.title}
          </h2>
          <p className="max-w-4xl text-muted-foreground text-balance text-sm md:text-base">
            {header.description}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 overflow-hidden rounded-lg border bg-card md:grid-cols-2">
        <div className="flex grow flex-col border-b md:border-r md:border-b-0">
          <TabName icon={Code2Icon} name="Code" />
          <Code
            className="h-full rounded-none border-none"
            code={code}
            lang={lang}
          />
        </div>
        <div className="flex grow flex-col">
          <TabName icon={EyeIcon} name="Preview" />
          <ClientOnly
            className="relative grid h-full min-h-[300px] place-items-center bg-card py-20"
            ssr={null}
          >
            {preview}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
};

function TabName(props: {
  name: string;
  icon: React.FC<{ className: string }>;
}) {
  return (
    <div className="flex items-center gap-2 border-b p-4 text-muted-foreground text-sm">
      <props.icon className="size-4" />
      {props.name}
    </div>
  );
}
