import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  GridItemProps,
  Icon,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { type Chain } from "@thirdweb-dev/chains";
import { useAddress, useChainId, useSwitchChain } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { AppLayout } from "components/app-layouts/app";
import { ContractCard } from "components/explore/contract-card";
import { ChainIcon } from "components/icons/ChainIcon";
import { OnboardingSteps } from "components/onboarding/Steps";
import { DeprecatedAlert } from "components/shared/DeprecatedAlert";
import { CodeOverview } from "contract-ui/tabs/code/components/code-overview";
import { ExploreCategory, prefetchCategory } from "data/explore";
import { getDashboardChainRpc } from "lib/rpc";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { OPSponsoredChains } from "pages/chainlist";
import { useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiExternalLink,
  FiXCircle,
} from "react-icons/fi";
import {
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedCopyButton,
  TrackedLink,
} from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import { ThirdwebNextPage } from "utils/types";

type EVMContractProps = {
  chain: Chain;
  category: ExploreCategory | null;
};

const CHAIN_CATEGORY = "chain_page";

type ChainStats = {
  latency: number;
  blockNumber: number;
};

function lastElementOfArray<T>(arr: T[]): T {
  return arr[arr.length - 1];
}

function useChainStats(
  chain: Chain,
  placeholderData: ChainStats = { latency: 0, blockNumber: 0 },
) {
  const rpcUrl = getDashboardChainRpc(chain);

  return useQuery({
    queryKey: ["chain_stats", { chainId: chain.chainId, rpcUrl }],
    queryFn: async () => {
      // we'll just ... manually fetch?
      const startTimeStamp = performance.now();
      const res = await fetch(rpcUrl, {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1,
        }),
      });

      const json = await res.json();
      const latency = performance.now() - startTimeStamp;

      return {
        latency,
        blockNumber: parseInt(json.result, 16),
      };
    },
    refetchInterval: 5 * 1000,
    enabled: !!rpcUrl,
    placeholderData,
  });
}

const lineaTestnetPopularContracts = [
  "thirdweb.eth/DropERC721",
  "thirdweb.eth/Marketplace",
  "thirdweb.eth/TokenERC721",
  "thirdweb.eth/DropERC1155",
  "thirdweb.eth/DropERC20",
  "thirdweb.eth/TokenERC1155",
];

const ChainPage: ThirdwebNextPage = ({
  chain,
  category,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const rpcStats = useChainStats(chain);
  const address = useAddress();

  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();

  const title = `${sanitizedChainName}: RPC and Chain Settings`;
  const description = `Use the best ${sanitizedChainName} RPC and add to your wallet. Discover the chain ID, native token, explorers, and ${
    chain.testnet && chain.faucets?.length ? "faucet options" : "more"
  }.`;

  const isLineaTestnet = chain?.chainId === 59140;

  const isDeprecated = chain?.status === "deprecated";
  const isSponsored = OPSponsoredChains.includes(chain?.chainId);

  const switchChain = useSwitchChain();

  const chainId = useChainId();
  const router = useRouter();
  const { switch: switchQuery } = router.query;

  useEffect(() => {
    if (
      chain.chainId &&
      address &&
      chainId !== chain.chainId &&
      switchQuery !== undefined
    ) {
      switchChain(chain.chainId);
    }
  }, [address, chain.chainId, chainId, switchChain, switchQuery]);

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          images: [
            {
              url: `${getAbsoluteUrl()}/api/og/chain/${chain.chainId}`,
              width: 1200,
              height: 630,
              alt: `${sanitizedChainName} (${chain.nativeCurrency.symbol}) on thirdweb`,
            },
          ],
        }}
      />
      <Box w="full" py={6}>
        <Container
          zIndex={2}
          position="relative"
          maxW="container.page"
          as={Flex}
          flexDirection="column"
          gap={6}
        >
          <Flex
            justify="space-between"
            as="header"
            gap={4}
            align="center"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Flex
              gap={6}
              align="center"
              flexGrow={1}
              flexDir={{ base: "column", md: "row" }}
            >
              {chain.icon && (
                <Flex boxSize={20} overflow="hidden" borderRadius="full">
                  <ChainIcon
                    ipfsSrc={chain.icon?.url}
                    size="100%"
                    borderRadius="50%"
                  />
                </Flex>
              )}
              <Flex
                direction="column"
                gap={3}
                alignItems={{ base: "center", md: "flex-start" }}
              >
                <Flex flexDir="column">
                  <Flex alignItems="center" gap={2}>
                    <Heading size="title.lg" as="h1">
                      {sanitizedChainName}
                    </Heading>
                    {isSponsored && (
                      <Flex
                        borderRadius="full"
                        align="center"
                        overflow="hidden"
                        flexShrink={0}
                        py={{ base: 1.5, md: 1 }}
                        px={{ base: 1.5, md: 2 }}
                        gap={3}
                        bgGradient="linear(to-r, #701953, #5454B2)"
                      >
                        <Heading size="label.sm" as="label" color="#fff">
                          Sponsored
                        </Heading>
                      </Flex>
                    )}
                  </Flex>
                  <Heading size="title.lg">
                    <Box
                      as="span"
                      opacity={0.6}
                      fontWeight={400}
                      fontSize="0.8em"
                      color="faded"
                    >
                      ({chain.nativeCurrency.symbol})
                    </Box>
                  </Heading>
                </Flex>
              </Flex>
            </Flex>
            {!isDeprecated && (
              <ClientOnly ssr={null}>
                <LinkButton
                  as={TrackedLink}
                  {...{
                    category: CHAIN_CATEGORY,
                  }}
                  background="bgBlack"
                  color="bgWhite"
                  _hover={{
                    opacity: 0.8,
                  }}
                  href="/explore"
                >
                  Deploy to {sanitizedChainName}
                </LinkButton>
              </ClientOnly>
            )}
          </Flex>
        </Container>
      </Box>

      <Container
        maxW="container.page"
        py={6}
        as={Flex}
        flexDirection="column"
        gap={10}
      >
        <DeprecatedAlert chain={chain} />
        <ClientOnly ssr={null}>
          {isSponsored && <OnboardingSteps onlyOptimism />}
        </ClientOnly>

        <SimpleGrid as="section" columns={{ base: 6, md: 12 }} rowGap={12}>
          {chain.infoURL && (
            <ChainSectionElement colSpan={6} label="Info">
              <TrackedLink
                isExternal
                category={CHAIN_CATEGORY}
                label="info_url"
                href={chain.infoURL}
              >
                <Heading maxW="full" noOfLines={1} size="label.lg">
                  {lastElementOfArray(chain.infoURL.split("//"))}
                </Heading>
              </TrackedLink>
            </ChainSectionElement>
          )}

          <ChainSectionElement colSpan={3} label="Chain ID">
            <Heading maxW="full" noOfLines={1} size="label.lg">
              {chain.chainId}
            </Heading>
          </ChainSectionElement>
          <ChainSectionElement colSpan={3} label="Native Token">
            <Heading maxW="full" noOfLines={1} size="label.lg">
              {chain.nativeCurrency.name} ({chain.nativeCurrency.symbol})
            </Heading>
          </ChainSectionElement>
        </SimpleGrid>
        {/* only render rpc section if we have an rpc for this chain */}
        {chain.rpc?.[0] && !isDeprecated ? (
          <SimpleGrid columns={{ base: 6, md: 12 }} rowGap={12}>
            <ChainSectionElement
              colSpan={6}
              label="RPC"
              status={
                rpcStats.isSuccess
                  ? "good"
                  : rpcStats.isError
                    ? "bad"
                    : "neutral"
              }
            >
              <Flex gap={2}>
                <Heading maxW="full" noOfLines={2} size="label.lg">
                  {chain.rpc[0].split(".com/")[0]}.com
                </Heading>
                <TrackedCopyButton
                  category={CHAIN_CATEGORY}
                  label="copy-rpc-url"
                  mt={-2}
                  aria-label="Copy RPC url"
                  variant="ghost"
                  size="sm"
                  value={`${chain.rpc[0].split(".com/")[0]}.com`}
                />
              </Flex>
            </ChainSectionElement>
            <ChainSectionElement colSpan={3} label="Block Height">
              <Heading
                fontFamily="mono"
                maxW="full"
                noOfLines={1}
                size="label.lg"
              >
                {rpcStats.data?.blockNumber || 0}
              </Heading>
            </ChainSectionElement>
            <ChainSectionElement colSpan={3} label="Latency">
              <Heading
                fontFamily="mono"
                maxW="full"
                noOfLines={1}
                size="label.lg"
              >
                {(rpcStats.data?.latency || 0).toFixed(0)}
                <Text as="span" color="accent.700">
                  {" "}
                  ms
                </Text>
              </Heading>
            </ChainSectionElement>
          </SimpleGrid>
        ) : null}
        {chain.faucets?.length ? (
          <ChainSectionElement colSpan={12} label="Faucets">
            <SimpleGrid columns={{ base: 6, md: 12 }} gridGap={6}>
              {chain.faucets.map((faucet) => {
                const url = new URL(faucet);
                const hostnameSplit = url.hostname.split(".");
                const tld = hostnameSplit.pop();
                const domain = hostnameSplit.pop();
                const displayTitle = `${domain}.${tld}`;
                // eslint-disable-next-line no-template-curly-in-string
                if (url.search.includes("${ADDRESS}")) {
                  if (address) {
                    // eslint-disable-next-line no-template-curly-in-string
                    url.search = url.search.replace("${ADDRESS}", address);
                  } else {
                    url.search = "";
                  }
                }
                return (
                  <GridItem colSpan={{ base: 6, md: 3 }} key={url.toString()}>
                    <Card
                      as={LinkBox}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={4}
                    >
                      <Flex gap={2} direction="column" maxW="75%">
                        <Heading as="h5" size="label.md" noOfLines={1}>
                          {displayTitle}
                        </Heading>
                        <LinkOverlay
                          as={TrackedLink}
                          category={CHAIN_CATEGORY}
                          href={url.toString()}
                          label="faucet"
                          trackingProps={{
                            faucet: url.toString(),
                          }}
                          isExternal
                        >
                          <Text size="body.sm" noOfLines={1}>
                            {url.toString().split("://")[1]}
                          </Text>
                        </LinkOverlay>
                      </Flex>
                      <Icon flexShrink={0} as={FiExternalLink} />
                    </Card>
                  </GridItem>
                );
              })}
            </SimpleGrid>
          </ChainSectionElement>
        ) : null}
        {chain.explorers?.length ? (
          <ChainSectionElement colSpan={12} label="Explorers">
            <SimpleGrid columns={{ base: 6, md: 12 }} gridGap={6}>
              {chain.explorers.map((explorer) => {
                return (
                  <GridItem colSpan={{ base: 6, md: 3 }} key={explorer.url}>
                    <Card
                      as={LinkBox}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Flex direction="column" gap={2} maxW="75%">
                        <Heading as="h5" size="label.md">
                          {explorer.name}
                        </Heading>
                        <LinkOverlay
                          as={TrackedLink}
                          category={CHAIN_CATEGORY}
                          href={explorer.url}
                          label="explorer"
                          trackingProps={{
                            explorerName: explorer.name,
                            explorerUrl: explorer.url,
                          }}
                          noOfLines={1}
                          isExternal
                        >
                          <Text size="body.sm">
                            {explorer.url.split("://")[1]}
                          </Text>
                        </LinkOverlay>
                      </Flex>
                      <Icon as={FiExternalLink} />
                    </Card>
                  </GridItem>
                );
              })}
            </SimpleGrid>
          </ChainSectionElement>
        ) : null}

        <Divider />

        {category && (
          <ChainSectionElement
            colSpan={12}
            label="Popular Contracts"
            moreElem={
              <TrackedLink
                category={CHAIN_CATEGORY}
                href="/explore"
                color="blue.500"
                label="explore_more"
                display="flex"
                alignItems="center"
                gap={"0.5em"}
                _hover={{
                  textDecoration: "none",
                  color: "heading",
                }}
              >
                Explore more <BsArrowRight />
              </TrackedLink>
            }
          >
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
              gap={6}
              mt={2}
            >
              {(isLineaTestnet
                ? lineaTestnetPopularContracts
                : category.contracts
              ).map((publishedContractId, idx) => {
                const [publisher, contractId] = publishedContractId.split("/");
                return (
                  <ContractCard
                    key={publishedContractId}
                    publisher={publisher}
                    contractId={contractId}
                    tracking={{
                      source: `chain_${chain.slug}`,
                      itemIndex: `${idx}`,
                    }}
                  />
                );
              })}
            </Grid>
          </ChainSectionElement>
        )}

        {!isDeprecated && (
          <>
            <Divider />
            <CodeOverview onlyInstall chainId={chain.chainId} noSidebar />
          </>
        )}
      </Container>
    </>
  );
};

interface ChainSectionElementProps extends Pick<GridItemProps, "colSpan"> {
  label: string;
  status?: "good" | "bad" | "neutral";
  moreElem?: JSX.Element;
}

const statusIcons = {
  good: FiCheckCircle,
  bad: FiXCircle,
  neutral: FiAlertCircle,
};

const statusColors = {
  good: "green",
  bad: "red",
  neutral: "yellow",
};

const ChainSectionElement: ComponentWithChildren<ChainSectionElementProps> = ({
  colSpan,
  label,
  status,
  moreElem,
  children,
}) => {
  return (
    <GridItem colSpan={colSpan} as={Flex} flexDir="column" gap={2}>
      <Flex align="center" gap={4} justify="space-between">
        <Flex gap={1} align="center">
          <Heading as="h3" size="label.lg" opacity={0.6} fontWeight={400}>
            {label}
          </Heading>
          {status && (
            <Icon
              boxSize={3.5}
              as={statusIcons[status]}
              _light={{
                color: `${statusColors[status]}.600`,
              }}
              _dark={{
                color: `${statusColors[status]}.400`,
              }}
            />
          )}
        </Flex>
        {moreElem}
      </Flex>

      {children}
    </GridItem>
  );
};

export default ChainPage;
ChainPage.pageId = PageId.ChainLanding;
ChainPage.getLayout = (page, props) => {
  return (
    <AppLayout
      layout={"custom-contract"}
      noSEOOverride
      dehydratedState={props.dehydratedState}
    >
      {page}
    </AppLayout>
  );
};
// server side ---------------------------------------------------------------

const CHAIN_PAGE_CONTRACTS_CATEGORY = {
  id: "chain_page",
  name: "",
  description: "",
  contracts: [
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/Marketplace",
    "thirdweb.eth/TokenERC721",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/TokenERC1155",
  ],
} as const;
export const getStaticProps: GetStaticProps<EVMContractProps> = async (ctx) => {
  let chainSlug = ctx.params?.chainSlug;

  if (!chainSlug) {
    return {
      notFound: true,
    };
  }
  if (Array.isArray(chainSlug)) {
    chainSlug = chainSlug[0];
  }

  if (chainSlug === "localhost") {
    return {
      notFound: true,
    };
  }

  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch(`https://api.thirdweb.com/v1/chains/${chainSlug}`);
  const chain = (await res.json()).data as Chain | null;

  if (!chain) {
    return {
      notFound: true,
    };
  }

  // determine if the chainSlug is a chainId and not a slug
  if (chain?.slug !== chainSlug) {
    return {
      redirect: {
        destination: `/${chain.slug}`,
        permanent: false,
      },
    };
  }

  const chainRpc = getDashboardChainRpc(chain);
  // overwrite with the dashboard chain RPC (add the api key)
  if (chainRpc) {
    chain.rpc = [chainRpc];
  } else {
    chain.rpc = [];
  }

  const category = CHAIN_PAGE_CONTRACTS_CATEGORY;
  const queryClient = new QueryClient();
  if (category) {
    await prefetchCategory(category, queryClient);
  }

  return {
    revalidate: 60,
    props: {
      chain,
      category,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: "blocking",
    paths: [],
  };
};
