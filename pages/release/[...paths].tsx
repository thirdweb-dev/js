import { Flex, Spinner } from "@chakra-ui/react";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { Polygon } from "@thirdweb-dev/chains";
import { AppLayout } from "components/app-layouts/app";
import {
  ensQuery,
  fetchAllVersions,
  fetchContractPublishMetadataFromURI,
  fetchReleasedContractInfo,
  releaserProfileQuery,
} from "components/contract-components/hooks";
import {
  ReleaseWithVersionPage,
  ReleaseWithVersionPageProps,
} from "components/pages/release";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { getAllExploreReleases } from "data/explore";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK } from "lib/sdk";
import { GetStaticPaths, GetStaticProps } from "next";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";

type ReleasePageProps = {
  dehydratedState: DehydratedState;
} & ReleaseWithVersionPageProps;

const ReleasePage: ThirdwebNextPage = (props: ReleasePageProps) => {
  return (
    <PublisherSDKContext>
      <ReleaseWithVersionPage
        author={props.author}
        contractName={props.contractName}
        version={props.version}
      />
    </PublisherSDKContext>
  );
};

ReleasePage.pageId = PageId.DeployedProgram;

ReleasePage.getLayout = (page, props: ReleasePageProps) => {
  return (
    <AppLayout layout={undefined} dehydratedState={props.dehydratedState}>
      {page}
    </AppLayout>
  );
};

ReleasePage.fallback = (
  <AppLayout layout={undefined}>
    <Flex h="100%" justifyContent="center" alignItems="center">
      <Spinner size="xl" />
    </Flex>
  </AppLayout>
);

export default ReleasePage;

export const getStaticProps: GetStaticProps<ReleasePageProps> = async (ctx) => {
  const paths = ctx.params?.paths as string[];
  const [authorAddress, contractName, version = ""] = paths;

  if (!contractName) {
    return {
      notFound: true,
    };
  }

  const polygonSdk = getEVMThirdwebSDK(
    Polygon.chainId,
    getDashboardChainRpc(Polygon),
  );

  const queryClient = new QueryClient();
  const { address, ensName } = await queryClient.fetchQuery(
    ensQuery(authorAddress),
  );

  if (!address) {
    return {
      notFound: true,
    } as const;
  }

  // TODO get the latest version instead of all versions
  // OR wait till contract upgrade to have a faster call for this

  let allVersions: ReturnType<typeof fetchAllVersions> extends Promise<infer X>
    ? X
    : never = [];
  try {
    allVersions = await queryClient.fetchQuery(
      ["all-releases", address, contractName],
      () => fetchAllVersions(polygonSdk, address, contractName),
    );
  } catch (error) {
    return {
      notFound: true,
    } as const;
  }

  const release =
    allVersions.find((v) => v.version === version) || allVersions[0];

  const ensQueries = [queryClient.prefetchQuery(ensQuery(address))];
  if (ensName) {
    ensQueries.push(queryClient.prefetchQuery(ensQuery(ensName)));
  }

  // this can be very slow
  await Promise.all([
    ...ensQueries,
    queryClient.prefetchQuery(["released-contract", release], () =>
      fetchReleasedContractInfo(polygonSdk, release),
    ),
    queryClient.prefetchQuery(["publish-metadata", release.metadataUri], () =>
      fetchContractPublishMetadataFromURI(release.metadataUri),
    ),
    queryClient.prefetchQuery(releaserProfileQuery(release.releaser)),
  ]);

  const props: ReleasePageProps = {
    dehydratedState: dehydrate(queryClient),
    author: authorAddress,
    contractName,
    version,
  };

  return {
    props,
  };
};

// generate the explore releases at build time
// others will be generated at runtime via fallback
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: generateBuildTimePaths(),
  };
};

function generateBuildTimePaths() {
  const paths = getAllExploreReleases();
  return paths.map((path) => {
    return {
      params: {
        paths: path.split("/"),
      },
    };
  });
}
