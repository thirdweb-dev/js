import { QueryClient, dehydrate } from "@tanstack/react-query";
import { SupportedChainId } from "@thirdweb-dev/react/dist/constants/chain";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import {
  fetchAllVersions,
  fetchContractPublishMetadataFromURI,
  fetchReleasedContractInfo,
  fetchReleaserProfile,
  resolveAddressToEnsName,
  resolvePossibleENSName,
} from "components/contract-components/hooks";
import { CustomContractPage } from "components/pages/custom-contract";
import {
  ReleaseWithVersionPage,
  ReleaseWithVersionPageProps,
} from "components/pages/release";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { isAddress } from "ethers/lib/utils";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ReactElement } from "react";
import {
  SupportedNetworkToChainIdMap,
  getChainIdFromNetwork,
} from "utils/network";
import { getSingleQueryValue } from "utils/router";

function CatchAllPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
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
}

CatchAllPage.getLayout = function (
  page: ReactElement,
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return (
    <AppLayout
      layout={props.pageType === "contract" ? "custom-contract" : undefined}
    >
      {page}
    </AppLayout>
  );
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

export const getServerSideProps: GetServerSideProps<PossiblePageProps> = async (
  ctx,
) => {
  const networkOrAddress = getSingleQueryValue(
    ctx.query,
    "networkOrAddress",
  ) as string;

  // handle old dashboard urls
  if (networkOrAddress === "dashboard") {
    return {
      redirect: {
        destination: ctx.resolvedUrl.replace("/dashboard", ""),
        permanent: false,
      },
    };
  }
  // handle old contract urls
  if (networkOrAddress === "contracts") {
    return {
      redirect: {
        destination: ctx.resolvedUrl
          .replace("/contracts", "")
          .replace("/latest", ""),
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();
  const sdk = new ThirdwebSDK("polygon");

  // handle the case where the user is trying to access a custom contract
  if (networkOrAddress in SupportedNetworkToChainIdMap) {
    const [contractAddress] = ctx.query.catchAll as (string | undefined)[];

    if (contractAddress && isPossibleAddress(contractAddress)) {
      await queryClient.prefetchQuery(["ens-address", contractAddress], () =>
        resolvePossibleENSName(contractAddress),
      );

      // cache for 10 seconds, with up to 60 seconds of stale time
      ctx.res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59",
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
    const [contractName, version = ""] = ctx.query.catchAll as (
      | string
      | undefined
    )[];

    if (contractName) {
      const resolvedAddress = await queryClient.fetchQuery(
        ["ens-address", networkOrAddress],
        () => resolvePossibleENSName(networkOrAddress),
      );

      if (!resolvedAddress) {
        return {
          notFound: true,
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
        queryClient.prefetchQuery(
          ["publish-metadata", release.metadataUri],
          () => fetchContractPublishMetadataFromURI(release.metadataUri),
        ),
        queryClient.prefetchQuery(["releaser-profile", resolvedAddress], () =>
          fetchReleaserProfile(sdk, resolvedAddress),
        ),
        queryClient.prefetchQuery(["ens-name", resolvedAddress], () =>
          resolveAddressToEnsName(resolvedAddress),
        ),
      ]);

      // cache for 10 seconds, with up to 60 seconds of stale time
      ctx.res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59",
      );

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

// if a string is a valid address or ens name
function isPossibleAddress(address: string) {
  return isAddress(address) || address.endsWith(".eth");
}
