import {
  Box,
  Center,
  Container,
  DarkMode,
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
import { useAddress } from "@thirdweb-dev/react";
import color from "color";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { AppLayout } from "components/app-layouts/app";
import { ContractCard } from "components/explore/contract-card";
import { ChainIcon } from "components/icons/ChainIcon";
import { CodeOverview } from "contract-ui/tabs/code/components/code-overview";
import { ExploreCategory, prefetchCategory } from "data/explore";
import { getDashboardChainRpc } from "lib/rpc";
import { StorageSingleton } from "lib/sdk";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import Vibrant from "node-vibrant";
import { PageId } from "page-id";
import { useMemo } from "react";
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
  gradientColors: [string, string] | null;
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
  gradientColors,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const rpcStats = useChainStats(chain);

  const address = useAddress();

  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();

  const title = `${sanitizedChainName}: RPC and Chain Settings`;
  const description = `Use the best ${sanitizedChainName} RPC and add to your wallet. Discover the chain ID, native token, explorers, and ${
    chain.testnet && chain.faucets?.length ? "faucet options" : "more"
  }.`;

  const gradient = useMemo(() => {
    if (!gradientColors?.length) {
      return "#000";
    }
    return `linear-gradient(180deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`;
  }, [gradientColors]);

  const isLineaTestnet = chain?.chainId === 59140;

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
      <Box
        w="full"
        py={{ base: 12, md: 20 }}
        mb={{ base: 2, md: 6 }}
        mt={-8}
        boxShadow="lg"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: gradient,
        }}
        _after={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,

          bg: "linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25))",
        }}
      >
        <DarkMode>
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
                  <Center
                    boxSize={20}
                    overflow="hidden"
                    bg="linear-gradient(180deg, rgba(255,255,255, 0.8), rgba(255,255,255, 1), rgba(255,255,255, 0.8))"
                    border={`2px solid ${
                      gradientColors ? gradientColors[0] : "#fff"
                    }`}
                    borderRadius="full"
                    p={2.5}
                  >
                    <ChainIcon
                      ipfsSrc={chain.icon?.url}
                      size="100%"
                      borderRadius="50%"
                    />
                  </Center>
                )}
                <Flex
                  direction="column"
                  gap={3}
                  alignItems={{ base: "center", md: "flex-start" }}
                >
                  <Heading size="title.lg" as="h1">
                    {sanitizedChainName}{" "}
                    {sanitizedChainName.length > 10 && <br />}
                    <Box
                      as="span"
                      opacity={0.6}
                      fontWeight={400}
                      fontSize="0.8em"
                    >
                      ({chain.nativeCurrency.symbol})
                    </Box>
                  </Heading>
                </Flex>
              </Flex>
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
                  Deploy to {chain.name}
                </LinkButton>
              </ClientOnly>
            </Flex>
          </Container>
        </DarkMode>
      </Box>

      <Container
        maxW="container.page"
        py={6}
        as={Flex}
        flexDirection="column"
        gap={10}
      >
        {category && (
          <>
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
                  const [publisher, contractId] =
                    publishedContractId.split("/");
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
            <Divider />
          </>
        )}
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
        {chain.rpc?.[0] ? (
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
        <CodeOverview onlyInstall chain={chain} noSidebar />
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

  let gradientColors: [string, string] | null = null;
  try {
    gradientColors = await getGradientColorStops(chain);
  } catch (e) {
    // ignore
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
      gradientColors,
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

async function getGradientColorStops(
  chain: Chain,
): Promise<[string, string] | null> {
  if (!chain.icon) {
    return null;
  }
  const chainIconUrl = StorageSingleton.resolveScheme(chain.icon.url);
  const optimizedIconUrl = `${getAbsoluteUrl()}/_next/image?url=${encodeURIComponent(
    chainIconUrl,
  )}&w=256&q=75`;
  const data = await fetch(optimizedIconUrl);

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const palette = await new Vibrant(buffer).getPalette();
  const colorStops = Object.values(palette)
    .map((color_) => {
      return color_?.hex;
    })
    .filter(Boolean) as string[];
  if (colorStops.length === 0) {
    return null;
  }
  const firstAndLast = [colorStops[0], colorStops[colorStops.length - 1]] as [
    string,
    string,
  ];

  const firstColorRGB = color(firstAndLast[0]).rgb().array();
  // if all rgb values are *close* to the same count it as grayscale
  if (firstColorRGB.every((rgb) => Math.abs(rgb - firstColorRGB[0]) < 10)) {
    return null;
  }
  const lastColorRGB = color(firstAndLast[1]).rgb().array();
  // if all rgb values are *close* to the same count it as grayscale
  if (lastColorRGB.every((rgb) => Math.abs(rgb - lastColorRGB[0]) < 10)) {
    return null;
  }

  return firstAndLast;
}
