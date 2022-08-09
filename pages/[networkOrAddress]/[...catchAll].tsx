import { QueryClient, dehydrate } from "@tanstack/react-query";
import { SupportedChainId } from "@thirdweb-dev/react/dist/constants/chain";
import { ChainId } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import {
  ens,
  fetchAllVersions,
  fetchContractPublishMetadataFromURI,
  fetchReleasedContractInfo,
  fetchReleaserProfile,
} from "components/contract-components/hooks";
import { CustomContractPage } from "components/pages/custom-contract";
import {
  ReleaseWithVersionPage,
  ReleaseWithVersionPageProps,
} from "components/pages/release";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { isAddress } from "ethers/lib/utils";
import { isEnsName } from "lib/ens";
import { getSSRSDK } from "lib/ssr-sdk";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import { ReactElement } from "react";
import {
  SupportedNetworkToChainIdMap,
  getChainIdFromNetwork,
} from "utils/network";
import { getSingleQueryValue } from "utils/router";

const CatchAllPage: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  if (props.pageType === "contract") {
    return (
      <CustomContractPage
        contractAddress={props.contractAddress}
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
      layout={props.pageType === "contract" ? "custom-contract" : undefined}
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
      chainId: SupportedChainId;
    };

export const getStaticProps: GetStaticProps<PossiblePageProps> = async (
  ctx,
) => {
  const networkOrAddress = getSingleQueryValue(
    ctx.params,
    "networkOrAddress",
  ) as string;
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
  const polygonSdk = getSSRSDK(ChainId.Polygon);

  // handle the case where the user is trying to access a custom contract
  if (networkOrAddress in SupportedNetworkToChainIdMap) {
    const [contractAddress] = ctx.params?.catchAll as (string | undefined)[];

    if (contractAddress && isPossibleAddress(contractAddress)) {
      await queryClient.prefetchQuery(ens.queryKey(contractAddress), () =>
        ens.fetch(contractAddress),
      );

      return {
        props: {
          dehydratedState: dehydrate(queryClient),
          pageType: "contract",
          contractAddress: contractAddress as string,
          network: networkOrAddress,
          chainId: getChainIdFromNetwork(networkOrAddress) as SupportedChainId,
        },
      };
    }
  } else if (isPossibleAddress(networkOrAddress)) {
    // we're in release world
    const [contractName, version = ""] = ctx.params?.catchAll as (
      | string
      | undefined
    )[];

    if (contractName) {
      const { address, ensName } = await queryClient.fetchQuery(
        ens.queryKey(networkOrAddress),
        () => ens.fetch(networkOrAddress),
      );

      if (!address) {
        return {
          notFound: true,
        };
      }

      const allVersions = await queryClient.fetchQuery(
        ["all-releases", address, contractName],
        () => fetchAllVersions(polygonSdk, address, contractName),
      );

      const release =
        allVersions.find((v) => v.version === version) || allVersions[0];

      const ensQueries = [
        queryClient.prefetchQuery(ens.queryKey(address), () =>
          ens.fetch(address),
        ),
      ];
      if (ensName) {
        ensQueries.push(
          queryClient.prefetchQuery(ens.queryKey(ensName), () =>
            ens.fetch(ensName),
          ),
        );
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
        queryClient.prefetchQuery(["releaser-profile", address], () =>
          fetchReleaserProfile(polygonSdk, address),
        ),
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
    paths: [],
  };
};

// if a string is a valid address or ens name
function isPossibleAddress(address: string) {
  return isAddress(address) || isEnsName(".eth");
}
