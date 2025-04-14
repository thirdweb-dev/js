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
        <div className="mb-4 space-y-0.5">
          <h2 className="font-semibold text-2xl tracking-tight">
            {header.title}
          </h2>
          <p className="max-w-3xl text-muted-foreground ">
            {header.description}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 overflow-hidden rounded-lg border bg-card md:grid-cols-2">
        <div className="flex grow flex-col border-b md:border-r md:border-b-0">
          <TabName name="Code" icon={Code2Icon} />
          <Code
            code={code}
            lang={lang}
            className="h-full rounded-none border-none"
          />
        </div>
        <div className="flex grow flex-col">
          <TabName name="Preview" icon={EyeIcon} />
          <ClientOnly
            ssr={null}
            className="relative grid h-full min-h-[300px] place-items-center bg-background py-20"
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
