import { Flex, Select, Skeleton } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { useAllVersions } from "components/contract-components/hooks";
import { ReleasedContract } from "components/contract-components/released-contract";
import { FeatureIconMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { ReactElement, useMemo } from "react";
import { Heading, LinkButton, Text } from "tw-components";

const ContractsNamePageWrapped = () => {
  const wallet = useSingleQueryParam("wallet");
  const contractName = useSingleQueryParam("contractName");
  const version = useSingleQueryParam("version");
  const router = useRouter();

  const allVersions = useAllVersions(wallet, contractName);

  const release = useMemo(() => {
    if (version) {
      return allVersions.data?.find((v) => v.version === version);
    }
    return allVersions.data?.[0];
  }, [allVersions?.data, version]);

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
          <Select
            onChange={(e) =>
              router.push(
                `/contracts/${wallet}/${contractName}/${e.target.value}`,
              )
            }
            w={24}
            value={version}
          >
            {(allVersions?.data || []).map((releasedVersion) => (
              <option
                key={releasedVersion.version}
                value={releasedVersion.version}
              >
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
            Deploy Now
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
