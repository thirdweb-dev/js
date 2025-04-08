import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CodeClient } from "@/components/ui/code/code.client";
import type { Abi } from "abitype";
import type { SourceFile } from "../types";

export function SourcesAccordion({
  sources,
  abi,
}: { sources: SourceFile[]; abi?: Abi }) {
  console.log({ sources });
  return (
    <Accordion type="multiple" className="w-full">
      {abi && (
        <SourceAccordionItem
          filename="ABI"
          code={JSON.stringify(abi, null, 2)}
          accordionId="abi"
          lang="json"
        />
      )}

      {sources.map((signature, i) => (
        <SourceAccordionItem
          key={signature.filename}
          filename={signature.filename || "Unknown"}
          code={signature.source.trim()}
          accordionId={`acc-${i}`}
          lang="solidity"
        />
      ))}
    </Accordion>
  );
}

function SourceAccordionItem(props: {
  filename: string;
  code: string;
  accordionId: string;
  lang: "solidity" | "json";
}) {
  return (
    <AccordionItem
      value={props.accordionId}
      className="first:border-t-0 last:border-b-0"
    >
      <AccordionTrigger className="flex justify-between px-4 py-3 font-mono text-sm">
        {props.filename}
      </AccordionTrigger>
      <AccordionContent className="border-t p-0">
        <CodeClient
          code={props.code}
          lang={props.lang}
          scrollableClassName="max-h-[600px]"
          className="rounded-none border-none"
        />
      </AccordionContent>
    </AccordionItem>
  );
}
