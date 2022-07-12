import { Flex, Select, Skeleton } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { useAllVersions } from "components/contract-components/hooks";
import { ReleasedContract } from "components/contract-components/released-contract";
import { FeatureIconMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { ReactElement, useMemo, useState } from "react";
import { Heading, LinkButton, Text } from "tw-components";

const ContractsNamePageWrapped = () => {
  const wallet = useSingleQueryParam("wallet");
  const contractName = useSingleQueryParam("contractName");
  const allVersions = useAllVersions(wallet, contractName);
  const [selectedVersion, setSelectedVersion] = useState<string>();

  const release = useMemo(() => {
    if (selectedVersion) {
      return allVersions.data?.find((v) => v.version === selectedVersion);
    }
    return allVersions.data?.[0];
  }, [allVersions?.data, selectedVersion]);

  return (
    <Flex direction="column" gap={8}>
      <Flex justifyContent="space-between" w="full">
        <Flex gap={4} alignItems="center">
          <ChakraNextImage src={FeatureIconMap["custom"]} boxSize={12} alt="" />
          <Skeleton isLoaded={allVersions.isSuccess}>
            <Heading size="title.md">{release?.name}</Heading>
            <Text>{release?.description}</Text>
          </Skeleton>
        </Flex>
        <Flex gap={3}>
          <Select onChange={(e) => setSelectedVersion(e.target.value)} w={24}>
            {(allVersions.data || []).map((releasedVersion) => (
              <option key={releasedVersion.id} value={releasedVersion.version}>
                {releasedVersion.version}
              </option>
            ))}
          </Select>
          <LinkButton
            colorScheme="purple"
            href={`/contracts/deploy/${encodeURIComponent(
              release?.metadataUri.replace("ipfs://", "") || "",
            )}`}
          >
            Deploy {selectedVersion || "Now"}
          </LinkButton>
        </Flex>
      </Flex>
      <Flex>{release && <ReleasedContract release={release} />}</Flex>
    </Flex>
  );
};

export default function ContractNamePage() {
  return (
    <PublisherSDKContext>
      <ContractsNamePageWrapped />
    </PublisherSDKContext>
  );
}

ContractNamePage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
