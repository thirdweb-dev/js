import { QueryClient, dehydrate } from "@tanstack/react-query";
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
import { BuiltinContractMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { ContractTabRouter } from "contract-ui/layout/tab-router";
import {
  isPossibleEVMAddress,
  isPossibleSolanaAddress,
} from "lib/address-utils";
import { getEVMThirdwebSDK } from "lib/sdk";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import { ReactElement } from "react";
import {
  DashboardSolanaNetwork,
  SupportedNetwork,
  SupportedNetworkToChainIdMap,
  getChainIdFromNetworkPath,
  getSolNetworkFromNetworkPath,
  isSupportedSOLNetwork,
} from "utils/network";
import { getSingleQueryValue } from "utils/router";

const CatchAllPage: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
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

CatchAllPage.getLayout = function (
  page: ReactElement,
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return (
    <AppLayout
      layout={props.pageType !== "release" ? "custom-contract" : undefined}
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
  | ({ pageType: "release" } & ReleaseWithVersionPageProps)
  | {
      pageType: "contract";
      contractAddress: string;
      network: string;
      chainId: SUPPORTED_CHAIN_ID;
    }
  | {
      pageType: "program";
      programAddress: string;
      network: DashboardSolanaNetwork;
    };

export const getStaticProps: GetStaticProps<PossiblePageProps> = async (
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

      // TODO get the latest version instead of all versions
      // OR wait till contract upgrade to have a faster call for this
      const allVersions = await queryClient.fetchQuery(
        ["all-releases", address, contractName],
        () => fetchAllVersions(polygonSdk, address, contractName),
      );

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
  return [
    ...Object.values(BuiltinContractMap)
      .filter((c) => c.contractType !== "custom")
      .map((v) => ({
        params: {
          networkOrAddress: "deployer.thirdweb.eth",
          catchAll: [v.id],
        },
      })),
    ...communityReleases.map((v) => ({
      params: {
        networkOrAddress: v.releaser,
        catchAll: [v.contractId],
      },
    })),
  ];
}

const communityReleases = [
  {
    releaser: "unlock-protocol.eth",
    contractId: "PublicLock",
  },
] as const;
