import {
  Divider,
  Flex,
  GridItem,
  Image,
  Select,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { PREBUILT_CONTRACTS_MAP } from "@thirdweb-dev/sdk/evm";
import { ChakraNextImage } from "components/Image";
import { DeployFormDrawer } from "components/contract-components/contract-deploy-form/drawer";
import { ens, useAllVersions } from "components/contract-components/hooks";
import { ReleasedContract } from "components/contract-components/released-contract";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import { FeatureIconMap } from "constants/mappings";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceIpfsUrl } from "lib/sdk";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Heading, Text } from "tw-components";

export interface ReleaseWithVersionPageProps {
  author: string;
  contractName: string;
  version: string;
}

export const ReleaseWithVersionPage: React.FC<ReleaseWithVersionPageProps> = ({
  author,
  contractName,
  version: initialVersion,
}) => {
  const trackEvent = useTrack();
  const ensQuery = ens.useQuery(author);

  const [version, setVersion] = useState(initialVersion);

  const router = useRouter();

  const allVersions = useAllVersions(
    ensQuery.data?.address || undefined,
    contractName,
  );

  const release = useMemo(() => {
    return (
      allVersions.data?.find((v) => v.version === version) ||
      allVersions.data?.[0]
    );
  }, [allVersions?.data, version]);

  // If this release is released by us and is a prebuilt contract we know about, open the custom deploy form
  const prebuiltContractName =
    release?.releaser === THIRDWEB_DEPLOYER_ADDRESS
      ? Object.values(PREBUILT_CONTRACTS_MAP).find(
          (value) => value.name === contractName,
        )?.contractType
      : undefined;

  const deployContractId =
    prebuiltContractName || release?.metadataUri.replace("ipfs://", "");

  return (
    <SimpleGrid columns={12} gap={{ base: 6, md: 10 }} w="full">
      <GridItem colSpan={{ base: 12, md: 8 }}>
        <Flex gap={4} alignItems="center">
          {release?.logo ? (
            <Image
              alt={release.name}
              borderRadius="full"
              src={replaceIpfsUrl(release.logo)}
              boxSize={14}
            />
          ) : (
            <ChakraNextImage
              flexShrink={0}
              src={FeatureIconMap["custom"]}
              boxSize={14}
              alt=""
            />
          )}

          <Skeleton isLoaded={allVersions.isSuccess}>
            <Flex direction="column" gap={2}>
              <Heading size="title.md">{release?.name}</Heading>
              <Text>{release?.description}</Text>
            </Flex>
          </Skeleton>
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 4 }}>
        <Flex gap={3}>
          <Select
            onChange={(e) => {
              trackEvent({
                category: "release-selector",
                action: "click",
                version_selected: e.target.value,
              });
              const path =
                e.target.value === allVersions.data?.[0].version
                  ? `/${author}/${contractName}`
                  : `/${author}/${contractName}/${e.target.value}`;
              router.push(path, undefined, { shallow: true });
              setVersion(e.target.value);
            }}
            value={version}
          >
            {(allVersions?.data || []).map((releasedVersion, idx) => (
              <option
                key={releasedVersion.version}
                value={releasedVersion.version}
              >
                {releasedVersion.version}
                {idx === 0 ? " (latest)" : ""}
              </option>
            ))}
          </Select>
          {deployContractId && (
            <DeployFormDrawer contractId={deployContractId} />
          )}
        </Flex>
      </GridItem>
      <GridItem colSpan={12} display={{ base: "inherit", md: "none" }}>
        <Divider />
      </GridItem>
      {release && <ReleasedContract release={release} walletOrEns={author} />}
    </SimpleGrid>
  );
};
