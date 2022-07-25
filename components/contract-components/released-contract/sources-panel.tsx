import type { ExtendedReleasedContractInfo } from ".";
import { ContractPublishMetadata } from "../hooks";
import { Center, Flex, Icon, Spinner } from "@chakra-ui/react";
import {
  PublishedMetadata,
  fetchSourceFilesFromMetadata,
} from "@thirdweb-dev/sdk";
import { StorageSingleton } from "components/app-layouts/providers";
import { FiXCircle } from "react-icons/fi";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";
import { Card, CodeBlock, Heading, Link } from "tw-components";

interface SourcesPanelProps {
  release: ExtendedReleasedContractInfo;
  contractReleaseMetadata?: ContractPublishMetadata;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({
  release,
  contractReleaseMetadata,
}) => {
  const sources = useQuery(
    ["sources", release],
    async () => {
      invariant(
        contractReleaseMetadata?.compilerMetadata?.sources,
        "no compilerMetadata sources available",
      );
      return (
        await fetchSourceFilesFromMetadata(
          {
            metadata: {
              sources: contractReleaseMetadata.compilerMetadata.sources,
            },
          } as unknown as PublishedMetadata,
          StorageSingleton,
        )
      )
        .filter((source) => !source.filename.includes("@"))
        .map((source) => {
          return {
            ...source,
            filename: source.filename.split("/").pop(),
          };
        });
    },
    { enabled: !!contractReleaseMetadata?.compilerMetadata?.sources },
  );

  return sources.isLoading ? (
    <Card>
      <Center>
        <Spinner mr={4} /> Loading sources...
      </Center>
    </Card>
  ) : sources.data && sources.data.length > 0 ? (
    <Flex direction="column" gap={8}>
      {sources.data.map((signature) => (
        <Flex gap={4} flexDirection="column" key={signature.filename}>
          <Heading size="label.md">{signature.filename}</Heading>
          <CodeBlock code={signature.source} language="solidity" />
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
          <Link href="https://portal.thirdweb.com/thirdweb-cli" isExternal>
            thirdweb CLI v0.5+
          </Link>
        </Heading>
      </Flex>
    </Card>
  );
};
