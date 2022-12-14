import redirects from "../../redirects";
import { useMainnetsContractList } from "@3rdweb-sdk/react";
import { Box, Flex } from "@chakra-ui/react";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react/evm";
import { ChainId } from "@thirdweb-dev/sdk/evm";
import { AppLayout } from "components/app-layouts/app";
import {
  ensQuery,
  fetchPublishedContracts,
  releaserProfileQuery,
  useEns,
  usePublishedContractsQuery,
  useReleaserProfile,
} from "components/contract-components/hooks";
import { EditProfile } from "components/contract-components/releaser/edit-profile";
import { ReleaserAvatar } from "components/contract-components/releaser/masked-avatar";
import { ReleaserSocials } from "components/contract-components/releaser/releaser-socials";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import { ReleasedContracts } from "components/contract-components/tables/released-contracts";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { getAllExplorePublishers } from "data/explore";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { getEVMThirdwebSDK } from "lib/sdk";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ProfileOG } from "og-lib/url-utils";
import { PageId } from "page-id";
import { useEffect, useMemo } from "react";
import { Heading, Text } from "tw-components";
import { getSingleQueryValue } from "utils/router";
import { ThirdwebNextPage } from "utils/types";
import { shortenIfAddress } from "utils/usedapp-external";

const UserPage: ThirdwebNextPage = () => {
  const wallet = useSingleQueryParam("networkOrAddress");

  const ens = useEns(wallet);

  const router = useRouter();

  // We do this so it doesn't break for users that haven't updated their CLI
  useEffect(() => {
    const previousPath = router.asPath.split("/")[2];
    if (
      previousPath !== "[networkOrAddress]" &&
      wallet?.startsWith("Qm") &&
      !wallet.endsWith(".eth")
    ) {
      router.replace(`/contracts/deploy/${previousPath}`);
    }
  }, [wallet, router]);

  const releaserProfile = useReleaserProfile(ens.data?.address || undefined);

  const displayName = shortenIfAddress(ens?.data?.ensName || wallet).replace(
    "deployer.thirdweb.eth",
    "thirdweb.eth",
  );

  const currentRoute = `https://thirdweb.com${router.asPath}`.replace(
    "deployer.thirdweb.eth",
    "thirdweb.eth",
  );

  const publishedContracts = usePublishedContractsQuery(
    ens.data?.address || undefined,
  );

  const mainnetsContractList = useMainnetsContractList(
    ens.data?.address || undefined,
  );

  const address = useAddress();

  const ogImage = useMemo(() => {
    if (!releaserProfile.data || !publishedContracts.data) {
      return undefined;
    }

    return ProfileOG.toUrl({
      displayName,
      bio: releaserProfile.data?.bio,
      avatar: releaserProfile.data?.avatar || undefined,
      releaseCnt: publishedContracts.data?.length.toString(),
    });
  }, [displayName, publishedContracts.data, releaserProfile.data]);

  return (
    <>
      <NextSeo
        title={displayName}
        description={`Visit ${displayName}'s profile. See their releases and deploy them in one click.`}
        openGraph={{
          title: displayName,
          images: ogImage
            ? [
                {
                  url: ogImage.toString(),
                  alt: `${displayName}'s profile on thirdweb.com`,
                  width: 1200,
                  height: 630,
                },
              ]
            : undefined,
          url: currentRoute,
        }}
        canonical={currentRoute}
      />

      <Flex flexDir="column" gap={12}>
        {wallet && (
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            w="full"
            align="center"
            gap={4}
          >
            <Flex gap={{ base: 4, md: 8 }} align="center" w="full">
              <ReleaserAvatar
                address={ens.data?.ensName || wallet}
                boxSize={28}
              />
              <Flex direction="column" gap={0}>
                <Heading as="h1" size="title.xl" color="white">
                  {displayName}
                </Heading>
                {releaserProfile.data?.bio && (
                  <Text size="body.lg" noOfLines={2}>
                    {releaserProfile.data.bio}
                  </Text>
                )}
                {releaserProfile.data && (
                  <ReleaserSocials
                    mt={1}
                    size="md"
                    releaserProfile={releaserProfile.data}
                  />
                )}
              </Flex>
            </Flex>
            {ens.data?.address === address && releaserProfile.data && (
              <Box flexShrink={0}>
                <EditProfile releaserProfile={releaserProfile.data} />
              </Box>
            )}
          </Flex>
        )}
        <Flex flexDir="column" gap={4}>
          <Flex gap={2} direction="column">
            <Heading size="title.md">Published contracts</Heading>
            <Text fontStyle="italic" maxW="container.md">
              All contracts published by this wallet
            </Text>
          </Flex>
          {ens.data?.address && (
            <ReleasedContracts address={ens.data?.address} noHeader />
          )}
        </Flex>
        <Flex flexDir="column" gap={4}>
          <Flex
            justify="space-between"
            align="top"
            gap={4}
            direction={{ base: "column", md: "row" }}
          >
            <Flex gap={2} direction="column">
              <Heading size="title.md">Deployed contracts</Heading>
              <Text fontStyle="italic" maxW="container.md">
                The list of contract instances that this wallet has deployed
                across all mainnets
              </Text>
            </Flex>
          </Flex>
          {ens.data?.address && (
            <DeployedContracts
              noHeader
              contractListQuery={mainnetsContractList}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

UserPage.getLayout = function getLayout(page, props) {
  return (
    <AppLayout {...props} noSEOOverride>
      <PublisherSDKContext>{page}</PublisherSDKContext>
    </AppLayout>
  );
};

UserPage.pageId = PageId.Profile;

export default UserPage;

const possibleRedirects = redirects().filter(
  (r) => r.source.split("/").length === 2,
);

export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  // TODO make this use alchemy / other RPC
  // currently blocked because our alchemy RPC does not allow us to call this from the server (since we have an allow-list)
  const polygonSdk = getEVMThirdwebSDK(ChainId.Polygon);

  const networkOrAddress = getSingleQueryValue(ctx.params, "networkOrAddress");

  const foundRedirect = possibleRedirects.find(
    (r) => r.source.split("/")[1] === networkOrAddress,
  );
  if (foundRedirect) {
    return {
      redirect: {
        destination: foundRedirect.destination,
        permanent: foundRedirect.permanent,
      },
    };
  }

  if (!networkOrAddress) {
    return {
      redirect: {
        destination: "/explore",
        permanent: false,
      },
    };
  }

  // handle deployer.thirdweb.eth urls
  if (networkOrAddress === "deployer.thirdweb.eth") {
    return {
      redirect: {
        destination: "/thirdweb.eth",
        permanent: true,
      },
    };
  }

  const { address, ensName } = await queryClient.fetchQuery(
    ensQuery(networkOrAddress),
  );

  if (!address) {
    return {
      redirect: {
        destination: "/explore",
        permanent: false,
      },
      props: {},
    };
  }

  const ensQueries = [queryClient.prefetchQuery(ensQuery(address))];
  if (ensName) {
    ensQueries.push(queryClient.prefetchQuery(ensQuery(ensName)));
  }

  await Promise.all([
    ...ensQueries,
    queryClient.prefetchQuery(releaserProfileQuery(address)),
    queryClient.prefetchQuery(["published-contracts", address], () =>
      fetchPublishedContracts(polygonSdk, queryClient, address),
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: getAllExplorePublishers().map((networkOrAddress) => ({
      params: {
        networkOrAddress,
      },
    })),
  };
};
