import { SourceFile } from "../types";
import { SourcesAccordion } from "./sources-accordion";
import { Flex } from "@chakra-ui/react";
import { Abi } from "@thirdweb-dev/sdk";
import { Link, Text } from "tw-components";

interface SourcesPanelProps {
  sources?: SourceFile[];
  abi?: Abi;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, abi }) => {
  return (
    <Flex flexDir="column" gap={8}>
      <Flex flexDir="column" gap={4}>
        {sources && sources?.length > 0 ? (
          <SourcesAccordion sources={sources} abi={abi} />
        ) : (
          <Text>
            Contract source code not available. Try deploying with{" "}
            <Link
              href="https://portal.thirdweb.com/contracts/deploy/overview"
              isExternal
              color="primary.500"
            >
              thirdweb CLI v0.5+
            </Link>
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
