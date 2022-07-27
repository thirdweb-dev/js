import {
  Divider,
  Flex,
  GridItem,
  Select,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import {
  fetchAllVersions,
  fetchContractPublishMetadataFromURI,
  fetchReleasedContractInfo,
  fetchReleaserProfile,
  resolveAddressToEnsName,
  resolvePossibleENSName,
  useAllVersions,
  useResolvedEnsName,
} from "components/contract-components/hooks";
import { ReleasedContract } from "components/contract-components/released-contract";
import { FeatureIconMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useMemo } from "react";
import { Heading, LinkButton, Text } from "tw-components";
import { getSingleQueryValue } from "utils/router";

const ContractsNamePageWrapped = () => {
  const wallet = useSingleQueryParam("wallet");
  const resolvedAddress = useResolvedEnsName(wallet);
  const contractName = useSingleQueryParam("contractName");
  const version = useSingleQueryParam("version");
  const router = useRouter();

  const allVersions = useAllVersions(
    resolvedAddress.data || undefined,
    contractName,
  );

  const release = useMemo(() => {
    return (
      allVersions.data?.find((v) => v.version === version) ||
      allVersions.data?.[0]
    );
  }, [allVersions?.data, version]);

  return (
    <SimpleGrid columns={12} gap={{ base: 6, md: 12 }} w="full">
      <GridItem colSpan={{ base: 12, md: 9 }}>
        <Flex gap={4} alignItems="center">
          <ChakraNextImage
            flexShrink={0}
            src={FeatureIconMap["custom"]}
            boxSize={12}
            alt=""
          />
          <Skeleton isLoaded={allVersions.isSuccess}>
            <Flex direction="column" gap={2}>
              <Heading size="title.md">{release?.name}</Heading>
              <Text>{release?.description}</Text>
            </Flex>
          </Skeleton>
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 3 }}>
        <Flex gap={3} direction="column">
          <Select
            onChange={(e) =>
              router.push(
                `/contracts/${wallet}/${contractName}/${e.target.value}`,
                undefined,
                { shallow: true },
              )
            }
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
          <LinkButton
            flexShrink={0}
            colorScheme="purple"
            href={`/contracts/deploy/${encodeURIComponent(
              release?.metadataUri.replace("ipfs://", "") || "",
            )}`}
          >
            Deploy Now
          </LinkButton>
        </Flex>
      </GridItem>
      <GridItem colSpan={12} display={{ base: "inherit", md: "none" }}>
        <Divider />
      </GridItem>
      {release && wallet && (
        <ReleasedContract release={release} walletOrEns={wallet} />
      )}
    </SimpleGrid>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // cache for 10 seconds, with up to 60 seconds of stale time
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59",
  );

  const queryClient = new QueryClient();
  // TODO make this use alchemy / other RPC
  // currently blocked because our alchemy RPC does not allow us to call this from the server (since we have an allow-list)
  const sdk = new ThirdwebSDK("polygon");

  const walletOrEnsAddress = getSingleQueryValue(ctx.query, "wallet");
  const contractName = getSingleQueryValue(ctx.query, "contractName");
  const version = getSingleQueryValue(ctx.query, "version");

  if (!walletOrEnsAddress) {
    return {
      redirect: {
        destination: "/contracts",
        permanent: false,
      },
      props: {},
    };
  }

  const resolvedAddress = await queryClient.fetchQuery(
    ["ens-address", walletOrEnsAddress],
    () => resolvePossibleENSName(walletOrEnsAddress),
  );

  if (!resolvedAddress) {
    return {
      redirect: {
        destination: "/contracts",
        permanent: false,
      },
      props: {},
    };
  }

  const allVersions = await queryClient.fetchQuery(
    ["all-releases", resolvedAddress, contractName],
    () => fetchAllVersions(sdk, resolvedAddress, contractName),
  );

  const release =
    allVersions.find((v) => v.version === version) || allVersions[0];

  await Promise.all([
    queryClient.prefetchQuery(["released-contract", release], () =>
      fetchReleasedContractInfo(sdk, release),
    ),
    queryClient.prefetchQuery(["publish-metadata", release.metadataUri], () =>
      fetchContractPublishMetadataFromURI(release.metadataUri),
    ),
    queryClient.prefetchQuery(["releaser-profile", resolvedAddress], () =>
      fetchReleaserProfile(sdk, resolvedAddress),
    ),
    queryClient.prefetchQuery(["ens-name", resolvedAddress], () =>
      resolveAddressToEnsName(resolvedAddress),
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
