import {
  Alert,
  AlertIcon,
  AlertTitle,
  Center,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
import {
  ens,
  fetchPublishedContracts,
  fetchReleaserProfile,
  usePublishedContractsQuery,
  useReleaserProfile,
} from "components/contract-components/hooks";
import { ReleaserHeader } from "components/contract-components/releaser/releaser-header";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { getSSRSDK } from "lib/ssr-sdk";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import { createProfileOGUrl } from "pages/_og/profile";
import { ReactElement, useEffect } from "react";
import { IoRefreshSharp } from "react-icons/io5";
import { Button, LinkButton, Text } from "tw-components";
import { getSingleQueryValue } from "utils/router";
import { shortenIfAddress } from "utils/usedapp-external";

const UserPage: ThirdwebNextPage = () => {
  const wallet = useSingleQueryParam("networkOrAddress");

  const ensQuery = ens.useQuery(wallet);

  const address = useAddress();
  const router = useRouter();
  const publishedContracts = usePublishedContractsQuery(
    ensQuery.data?.address || undefined,
  );

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

  const releaserProfile = useReleaserProfile(
    ensQuery.data?.address || undefined,
  );

  const displayName = shortenIfAddress(ensQuery?.data?.ensName || wallet);

  const currentRoute = `https://thirdweb.com${router.asPath}`;

  return (
    <>
      <NextSeo
        title={displayName}
        description={`Visit ${displayName}'s profile. See their releases and deploy them in one click.`}
        openGraph={{
          title: displayName,
          images: [
            {
              url: createProfileOGUrl({
                displayName,
                bio: releaserProfile.data?.bio,
                avatar: releaserProfile.data?.avatar || undefined,
                releaseCnt: publishedContracts.data?.length.toString(),
              }),
              alt: `${displayName}'s profile on thirdweb.com`,
            },
          ],
          url: currentRoute,
        }}
      />

      <Flex flexDir="column" gap={8}>
        {wallet && <ReleaserHeader wallet={wallet} />}
        <Flex flexDir="column" gap={4}>
          <DeployableContractTable
            isFetching={publishedContracts.isFetching}
            contractIds={(publishedContracts.data || [])?.map((d) =>
              d.metadataUri.replace("ipfs://", ""),
            )}
            context="view_release"
          >
            {publishedContracts.isLoading && (
              <Center>
                <Flex py={4} direction="row" gap={4} align="center">
                  {wallet && <Spinner size="sm" />}
                  <Text>
                    {wallet ? "Loading releases" : "No wallet connected"}
                  </Text>
                </Flex>
              </Center>
            )}
            {publishedContracts.isError && (
              <Center>
                <Flex mt={4} py={4} direction="column" gap={4} align="center">
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <AlertTitle mr={2}>
                      Failed to fetch released contracts
                    </AlertTitle>
                    <Button
                      onClick={() => publishedContracts.refetch()}
                      leftIcon={<IoRefreshSharp />}
                      ml="auto"
                      size="sm"
                      colorScheme="red"
                    >
                      Retry
                    </Button>
                  </Alert>
                </Flex>
              </Center>
            )}
            {publishedContracts.isSuccess &&
              publishedContracts.data.length === 0 && (
                <Center>
                  <Flex py={4} direction="column" gap={4} align="center">
                    <Text>No releases found.</Text>
                    {ensQuery.data?.address === address && (
                      <LinkButton
                        size="sm"
                        href="https://portal.thirdweb.com/release"
                        isExternal
                        variant="outline"
                        colorScheme="primary"
                      >
                        Learn more about releasing contracts
                      </LinkButton>
                    )}
                  </Flex>
                </Center>
              )}
          </DeployableContractTable>
        </Flex>
      </Flex>
    </>
  );
};

UserPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <PublisherSDKContext>{page}</PublisherSDKContext>
    </AppLayout>
  );
};

UserPage.pageId = PageId.Profile;

export default UserPage;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  // TODO make this use alchemy / other RPC
  // currently blocked because our alchemy RPC does not allow us to call this from the server (since we have an allow-list)
  const polygonSdk = getSSRSDK(ChainId.Polygon);

  const networkOrAddress = getSingleQueryValue(ctx.params, "networkOrAddress");

  if (!networkOrAddress) {
    return {
      redirect: {
        destination: "/contracts",
        permanent: false,
      },
      props: {},
    };
  }

  const { address, ensName } = await queryClient.fetchQuery(
    ens.queryKey(networkOrAddress),
    () => ens.fetch(networkOrAddress),
  );

  if (!address) {
    return {
      redirect: {
        destination: "/contracts",
        permanent: false,
      },
      props: {},
    };
  }

  const ensQueries = [
    queryClient.prefetchQuery(ens.queryKey(address), () => ens.fetch(address)),
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
    queryClient.prefetchQuery(["releaser-profile", address], () =>
      fetchReleaserProfile(polygonSdk, address),
    ),
    queryClient.prefetchQuery(["published-contracts", address], () =>
      fetchPublishedContracts(polygonSdk, address),
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
    paths: [],
  };
};
