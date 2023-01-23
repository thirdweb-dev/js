import { Flex, Spinner } from "@chakra-ui/react";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { ChainId, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk/evm";
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
import { ContractTabRouter } from "contract-ui/layout/tab-router";
import { getAllExploreReleases } from "data/explore";
import {
  isPossibleEVMAddress,
  isPossibleSolanaAddress,
} from "lib/address-utils";
import { getEVMThirdwebSDK } from "lib/sdk";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import { PageId } from "page-id";
import type { ParsedUrlQuery } from "querystring";
import { ReactElement } from "react";
import {
  DashboardSolanaNetwork,
  SupportedChainIdToNetworkMap,
  SupportedNetwork,
  SupportedNetworkToChainIdMap,
  getChainIdFromNetworkPath,
  getSolNetworkFromNetworkPath,
  isSupportedSOLNetwork,
} from "utils/network";
import { getSingleQueryValue } from "utils/router";
import { ThirdwebNextPage } from "utils/types";

const CatchAllPage: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Flex h="100%" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (props.pageType === "contract") {
    return (
      <ContractTabRouter
        address={props.contractAddress}
        ecosystem="evm"
        network={props.network}
      />
    );
  }

  if (props.pageType === "program") {
    return (
      <ContractTabRouter
        address={props.programAddress}
        ecosystem="solana"
        network={props.network}
      />
    );
  }
  if (props.pageType === "release") {
    return (
      <PublisherSDKContext>
        <ReleaseWithVersionPage
          author={props.author}
          contractName={props.contractName}
          version={props.version}
        />
      </PublisherSDKContext>
    );
  }
  return null;
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

CatchAllPage.getLayout = function (
  page: ReactElement,
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return (
    <AppLayout
      layout={props.pageType !== "release" ? "custom-contract" : undefined}
      dehydratedState={props.dehydratedState}
    >
      {page}
    </AppLayout>
  );
};

CatchAllPage.pageId = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  if (props.pageType === "contract") {
    return PageId.DeployedContract;
  }
  if (props.pageType === "program") {
    return PageId.DeployedProgram;
  }
  if (props.pageType === "release") {
    return PageId.ReleasedContract;
  }

  return PageId.Unknown;
};

export default CatchAllPage;

type PossiblePageProps =
  | ({
      pageType: "release";
      dehydratedState: DehydratedState;
    } & ReleaseWithVersionPageProps)
  | {
      pageType: "contract";
      contractAddress: string;
      network: string;
      chainId: SUPPORTED_CHAIN_ID;
      dehydratedState: DehydratedState;
    }
  | {
      pageType: "program";
      programAddress: string;
      network: DashboardSolanaNetwork;
      dehydratedState: DehydratedState;
    };

interface Params extends ParsedUrlQuery {
  networkOrAddress: string;
  catchAll: string[];
}

export const getStaticProps: GetStaticProps<PossiblePageProps, Params> = async (
  ctx,
) => {
  const networkOrAddress = getSingleQueryValue(
    ctx.params,
    "networkOrAddress",
  ) as string;

  // handle old contract paths
  if (networkOrAddress === "contracts") {
    return {
      redirect: {
        destination: "/explore",
        permanent: false,
      },
    };
  }
  // handle old dashboard urls
  if (networkOrAddress === "dashboard") {
    const pathSegments = ctx.params?.catchAll as string[];

    const destination = pathSegments.join("/");

    return {
      redirect: {
        destination: `/${destination}`,
        permanent: false,
      },
    };
  }
  // handle old contract urls
  if (networkOrAddress === "contracts") {
    const pathSegments = ctx.params?.catchAll as string[];

    const destination = pathSegments.join("/").replace("/latest", "");
    return {
      redirect: {
        destination: `/${destination}`,
        permanent: false,
      },
    };
  }

  // handle deployer.thirdweb.eth urls
  if (networkOrAddress === "deployer.thirdweb.eth") {
    const pathSegments = ctx.params?.catchAll as string[];

    return {
      redirect: {
        destination: `/thirdweb.eth/${pathSegments.join("/")}`,
        permanent: true,
      },
    };
  }

  const queryClient = new QueryClient();

  // handle the case where the user is trying to access a EVM contract
  if (networkOrAddress in SupportedNetworkToChainIdMap) {
    const [contractAddress] = ctx.params?.catchAll as string[];

    if (isPossibleEVMAddress(contractAddress)) {
      await queryClient.prefetchQuery(ensQuery(contractAddress));

      return {
        props: {
          dehydratedState: dehydrate(queryClient),
          pageType: "contract",
          contractAddress: contractAddress as string,
          network: networkOrAddress,
          chainId: getChainIdFromNetworkPath(
            networkOrAddress as SupportedNetwork,
          ) as SUPPORTED_CHAIN_ID,
        },
      };
    }
  }

  // support using chain-id instead of network name
  // redirect /<chain-id>/... to /<network>/...

  // if `networkOrAddress` is a supported chain-id
  if (networkOrAddress in SupportedChainIdToNetworkMap) {
    // get the network name from the chain-id
    const chainId = Number(networkOrAddress) as SUPPORTED_CHAIN_ID;
    const network = SupportedChainIdToNetworkMap[chainId];

    // get the rest of the path
    const catchAll = ctx.params?.catchAll;
    const rest = catchAll ? `/${catchAll.join("/")}` : "";

    return {
      redirect: {
        destination: `/${network}${rest}`,
        permanent: false,
      },
    };
  }

  // handle the case where the user is trying to access a solana contract
  else if (isSupportedSOLNetwork(networkOrAddress)) {
    const network = getSolNetworkFromNetworkPath(networkOrAddress);
    if (!network) {
      return {
        notFound: true,
      };
    }
    const [programAddress] = ctx.params?.catchAll as (string | undefined)[];
    if (isPossibleSolanaAddress(programAddress)) {
      // lets get the program type and metadata right here
      // TODO this would be great if it was fast, but alas it is slow af!
      // const solSDK = getSOLThirdwebSDK(network);
      // const program = await queryClient.fetchQuery(
      //   programQuery(queryClient, solSDK, programAddress),
      // );
      // await queryClient.prefetchQuery(programMetadataQuery(program));
      return {
        props: {
          dehydratedState: dehydrate(queryClient, {
            shouldDehydrateQuery: (query) =>
              // TODO this should use the util function, but for some reason it doesn't work
              !query.queryHash.includes("-instance"),
          }),
          pageType: "program",
          programAddress: programAddress as string,
          network: networkOrAddress as DashboardSolanaNetwork,
        },
      };
    }
  } else if (isPossibleEVMAddress(networkOrAddress)) {
    const polygonSdk = getEVMThirdwebSDK(ChainId.Polygon);
    // we're in release world
    const [contractName, version = ""] = ctx.params?.catchAll as (
      | string
      | undefined
    )[];

    if (contractName) {
      const { address, ensName } = await queryClient.fetchQuery(
        ensQuery(networkOrAddress),
      );

      if (!address) {
        return {
          notFound: true,
        };
      }

      type AllVersions = ReturnType<typeof fetchAllVersions> extends Promise<
        infer X
      >
        ? X
        : never;

      // TODO get the latest version instead of all versions
      // OR wait till contract upgrade to have a faster call for this
      let allVersions: AllVersions = [];
      try {
        allVersions = await queryClient.fetchQuery(
          ["all-releases", address, contractName],
          () => fetchAllVersions(polygonSdk, address, contractName),
        );
      } catch (error) {
        // if not valid contract URL, above code throws an error
        // in that case, show 404
        return {
          notFound: true,
        };
      }

      const release =
        allVersions.find((v) => v.version === version) || allVersions[0];

      const ensQueries = [queryClient.prefetchQuery(ensQuery(address))];
      if (ensName) {
        ensQueries.push(queryClient.prefetchQuery(ensQuery(ensName)));
      }

      await Promise.all([
        ...ensQueries,
        queryClient.prefetchQuery(["released-contract", release], () =>
          fetchReleasedContractInfo(polygonSdk, release),
        ),
        queryClient.prefetchQuery(
          ["publish-metadata", release.metadataUri],
          () => fetchContractPublishMetadataFromURI(release.metadataUri),
        ),
        queryClient.prefetchQuery(releaserProfileQuery(release.releaser)),
      ]);

      return {
        props: {
          dehydratedState: dehydrate(queryClient),
          pageType: "release",
          author: networkOrAddress,
          contractName,
          version,
        },
      };
    }
  }

  return {
    notFound: true,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: generateBuildTimePaths(),
  };
};

function generateBuildTimePaths() {
  const paths = getAllExploreReleases();
  return paths.map((path) => {
    const [networkOrAddress, contractId] = path.split("/");
    return {
      params: {
        networkOrAddress,
        catchAll: [contractId],
      },
    };
  });
}
