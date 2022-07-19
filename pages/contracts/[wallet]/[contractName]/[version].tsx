import { Flex, Select, Skeleton } from "@chakra-ui/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import {
  fetchAllVersions,
  fetchContractPublishMetadataFromURI,
  fetchReleasedContractInfo,
  fetchReleaserProfile,
  useAllVersions,
} from "components/contract-components/hooks";
import { ReleasedContract } from "components/contract-components/released-contract";
import { FeatureIconMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useMemo } from "react";
import { QueryClient, dehydrate } from "react-query";
import { Heading, LinkButton, Text } from "tw-components";
import { getSingleQueryValue } from "utils/router";

const ContractsNamePageWrapped = () => {
  const wallet = useSingleQueryParam("wallet");
  const contractName = useSingleQueryParam("contractName");
  const version = useSingleQueryParam("version");
  const router = useRouter();

  const allVersions = useAllVersions(wallet, contractName);

  const release = useMemo(() => {
    return (
      allVersions.data?.find((v) => v.version === version) ||
      allVersions.data?.[0]
    );
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
        <Flex gap={3} direction={{ base: "column", md: "row" }}>
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

  const wallet = getSingleQueryValue(ctx.query, "wallet");
  const contractName = getSingleQueryValue(ctx.query, "contractName");
  const version = getSingleQueryValue(ctx.query, "version");

  const allVersions = await queryClient.fetchQuery(
    ["all-releases", wallet, contractName],
    () => fetchAllVersions(sdk, wallet, contractName),
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
    queryClient.prefetchQuery(["releaser-profile", wallet], () =>
      fetchReleaserProfile(sdk, wallet),
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
