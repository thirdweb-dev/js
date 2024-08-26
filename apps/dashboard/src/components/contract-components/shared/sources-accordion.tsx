import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import type { Abi } from "abitype";
import { CodeBlock, Heading } from "tw-components";
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
                <Heading size="label.md">ABI</Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {isExpanded && (
                  <CodeBlock
                    code={JSON.stringify(abi, null, 2)}
                    language="json"
                    overflow="auto"
                  />
                )}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      )}
      {sources.map((signature) => (
        <AccordionItem
          gap={4}
          flexDirection="column"
          key={signature.filename}
          borderColor="borderColor"
          _first={{ borderTopWidth: 0 }}
          _last={{ borderBottomWidth: 0 }}
        >
          {({ isExpanded }) => (
            <>
              <AccordionButton justifyContent="space-between" py={2}>
                <Heading size="label.md">{signature.filename}</Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {isExpanded && (
                  <CodeBlock
                    overflow="auto"
                    code={signature.source.trim()}
                    language="solidity"
                  />
                )}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};
