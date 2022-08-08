import { Flex, Icon } from "@chakra-ui/react";
import { FiXCircle } from "react-icons/fi";
import { Card, CodeBlock, Heading, Link } from "tw-components";

export type SourceFile = {
  filename: string | undefined;
  source: string;
};

interface SourcesPanelProps {
  sources: SourceFile[];
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources }) => {
  return sources.length > 0 ? (
    <Flex direction="column" gap={8}>
      {sources.map((signature) => (
        <Flex gap={4} flexDirection="column" key={signature.filename}>
          <Heading size="label.md">{signature.filename}</Heading>
          <CodeBlock
            maxH="500px"
            overflow="auto"
            code={signature.source.trim()}
            language="solidity"
          />
        </Flex>
      ))}
    </Flex>
  ) : (
    <Card>
      <Flex direction="column" align="left" gap={2}>
        <Flex direction="row" align="center" gap={2}>
          <Icon as={FiXCircle} color="red.500" />
          <Heading size="title.sm">Contract source code not available</Heading>
        </Flex>
        <Heading size="subtitle.sm">
          Try deploying with{" "}
          <Link href="https://portal.thirdweb.com/cli" isExternal>
            thirdweb CLI v0.5+
          </Link>
        </Heading>
      </Flex>
    </Card>
  );
};
