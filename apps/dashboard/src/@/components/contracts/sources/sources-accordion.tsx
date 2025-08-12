import type { Abi } from "abitype";
import type { SourceFile } from "@/components/contract-components/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CodeClient } from "@/components/ui/code/code.client";

export function SourcesAccordion({
  sources,
  abi,
}: {
  sources: SourceFile[];
  abi?: Abi;
}) {
  return (
    <Accordion className="w-full" type="multiple">
      {abi && (
        <SourceAccordionItem
          accordionId="abi"
          code={JSON.stringify(abi, null, 2)}
          filename="ABI"
          lang="json"
        />
      )}

      {sources.map((signature, i) => (
        <SourceAccordionItem
          accordionId={`acc-${i}`}
          code={signature.source.trim()}
          filename={signature.filename || "Unknown"}
          key={signature.filename}
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
      className="first:border-t-0 last:border-b-0"
      value={props.accordionId}
    >
      <AccordionTrigger className="flex justify-between px-4 py-3 font-mono text-sm">
        {props.filename}
      </AccordionTrigger>
      <AccordionContent className="border-t p-0">
        <CodeClient
          className="rounded-none border-none"
          code={props.code}
          lang={props.lang}
          scrollableClassName="max-h-[600px]"
        />
      </AccordionContent>
    </AccordionItem>
  );
}
