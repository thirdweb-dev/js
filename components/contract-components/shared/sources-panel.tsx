import { Abi, SourceFile } from "../types";
import { SourcesAccordion } from "./sources-accordion";
import { Flex } from "@chakra-ui/react";
import { CodeBlock, Heading, Link, Text } from "tw-components";

interface SourcesPanelProps {
  sources?: SourceFile[];
  abi?: Abi;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, abi }) => {
  return (
    <Flex flexDir="column" gap={8}>
      {abi && (
        <Flex direction="column" gap={4} mb={{ base: 2, md: 0 }}>
          <Heading size="title.sm">ABI</Heading>
          <CodeBlock
            code={JSON.stringify(abi, null, 2)}
            language="json"
            maxH="500px"
            overflow="auto"
          />
        </Flex>
      )}

      <Flex flexDir="column" gap={4}>
        <Heading size="title.sm">Solidity</Heading>
        {sources && sources?.length > 0 ? (
          <SourcesAccordion sources={sources} />
        ) : (
          <Text>
            Contract source code not available. Try deploying with{" "}
            <Link
              href="https://portal.thirdweb.com/cli"
              isExternal
              color="blue.500"
            >
              thirdweb CLI v0.5+
            </Link>
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
