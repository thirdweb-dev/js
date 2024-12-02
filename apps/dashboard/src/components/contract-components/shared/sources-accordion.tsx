import { CodeClient } from "@/components/ui/code/code.client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import type { Abi } from "abitype";
import type { SourceFile } from "../types";

interface SourcesAccordionProps {
  sources: SourceFile[];
  abi?: Abi;
}

export const SourcesAccordion: React.FC<SourcesAccordionProps> = ({
  sources,
  abi,
}) => {
  return (
    <Accordion allowMultiple defaultIndex={[]}>
      {/* ABI Accordion is put at the top for better UX */}
      {abi && (
        <AccordionItem
          gap={4}
          flexDirection="column"
          borderColor="borderColor"
          _first={{ borderTopWidth: 0 }}
          _last={{ borderBottomWidth: 0 }}
        >
          {({ isExpanded }) => (
            <>
              <AccordionButton justifyContent="space-between" py={2}>
                <p className="font-semibold">ABI</p>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {isExpanded && (
                  <CodeClient code={JSON.stringify(abi, null, 2)} lang="json" />
                )}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      )}
      {sources.map((signature, i) => (
        <AccordionItem
          gap={4}
          flexDirection="column"
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          borderColor="borderColor"
          _first={{ borderTopWidth: 0 }}
          _last={{ borderBottomWidth: 0 }}
        >
          {({ isExpanded }) => (
            <>
              <AccordionButton justifyContent="space-between" py={2}>
                <p className="font-semibold">{signature.filename}</p>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {isExpanded && (
                  <CodeClient code={signature.source.trim()} lang="solidity" />
                )}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};
