import { SourceFile } from "../types";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import { CodeBlock, Heading } from "tw-components";

interface SourcesAccordionProps {
  sources: SourceFile[];
}

export const SourcesAccordion: React.FC<SourcesAccordionProps> = ({
  sources,
}) => {
  return (
    <Accordion allowToggle allowMultiple>
      {sources.map((signature) => (
        <AccordionItem
          gap={4}
          flexDirection="column"
          key={signature.filename}
          borderColor="borderColor"
        >
          <AccordionButton justifyContent="space-between" py={2}>
            <Heading size="label.md">{signature.filename}</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <CodeBlock
              maxH="500px"
              overflow="auto"
              code={signature.source.trim()}
              language="solidity"
            />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
