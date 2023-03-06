import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  GridItem,
  GridItemProps,
  Icon,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { Chain } from "@thirdweb-dev/chains";
import { useAddress } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { AppLayout } from "components/app-layouts/app";
import { ContractCard } from "components/explore/contract-card";
import { ChainIcon } from "components/icons/ChainIcon";
import { CodeOverview } from "contract-ui/tabs/code/components/code-overview";
import { ExploreCategory, prefetchCategory } from "data/explore";
import { useTrack } from "hooks/analytics/useTrack";
import {
  useConfiguredChainsRecord,
  useUpdateConfiguredChains,
} from "hooks/chains/configureChains";
import { getDashboardChainRpc } from "lib/rpc";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { useMemo } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiExternalLink,
  FiXCircle,
} from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import {
  Button,
  Card,
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedCopyButton,
  TrackedLink,
} from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import { getAllChainRecords } from "utils/allChainsRecords";
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

const ChainPage: ThirdwebNextPage = ({
  chain,
  category,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const configuredChainRecord = useConfiguredChainsRecord();
  const updateConfiguredNetworks = useUpdateConfiguredChains();
  const trackEvent = useTrack();
  const isConfigured = useMemo(() => {
    return (
      chain.chainId in configuredChainRecord &&
      !configuredChainRecord[chain.chainId].isAutoConfigured
    );
  }, [chain.chainId, configuredChainRecord]);

  const rpcStats = useChainStats(chain);

  const address = useAddress();

  const toast = useToast();

  const title = `${chain.name} (${chain.nativeCurrency.symbol}) | RPC, Smart Contracts, Blockchain SDKs`;
  const description = `Deploy smart contracts to ${
    chain.name
  } and build dApps with thirdweb's SDKs. Discover ${
    chain.nativeCurrency.symbol
  } RPCs, ${chain.faucets?.length ? "faucets," : "dApps"} & explorers.`;

  const addNetwork = () => {
    updateConfiguredNetworks.add([chain]);
    trackEvent({
      category: CHAIN_CATEGORY,
      chain,
      action: "add_chain",
      label: chain.slug,
    });

    toast({
      title: "Chain added",
      description: `You can now use ${chain.name} on thirdweb`,
      status: "success",
      duration: 3000,
    });
  };

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
              alt: `${chain.name} (${chain.nativeCurrency.symbol}) on thirdweb`,
            },
          ],
        }}
      />
      <Box
        w="full"
        _light={{
          bg: "linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.4) 100%)",
        }}
        _dark={{
          bg: "linear-gradient(180deg, rgba(0,0,0,.0) 0%, rgba(0,0,0,.5) 100%)",
        }}
        pb={{ base: 12, md: 20 }}
        mb={{ base: 2, md: 6 }}
        boxShadow="lg"
      >
        <Container
          maxW="container.page"
          as={Flex}
          flexDirection="column"
          gap={6}
        >
          <Flex pt={{ base: 4, md: 12 }}>
            <Link href="/chains" _hover={{ textDecor: "none" }} role="group">
              <Text size="label.md" _hover={{ color: "blue.500" }}>
                {"<-"} All Chains
              </Text>
            </Link>
          </Flex>
          <Flex
            justify="space-between"
            as="header"
            gap={4}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Flex
              gap={6}
              align="center"
              flexGrow={1}
              flexDir={{ base: "column", md: "row" }}
            >
              <Center boxSize={20} overflow="hidden">
                <ChainIcon ipfsSrc={chain.icon?.url} size={80} />
              </Center>
              <Flex
                direction="column"
                gap={3}
                alignItems={{ base: "center", md: "inherit" }}
              >
                <Heading size="title.lg" as="h1">
                  {chain.name} {chain.chain.length > 10 && <br />}
                  <Box
                    as="span"
                    opacity={0.6}
                    fontWeight={400}
                    fontSize="0.8em"
                  >
                    ({chain.nativeCurrency.symbol})
                  </Box>
                </Heading>

                <ClientOnly ssr={null}>
                  {isConfigured ? (
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
                  ) : (
                    <Button
                      background="bgBlack"
                      color="bgWhite"
                      _hover={{
                        opacity: 0.8,
                      }}
                      leftIcon={
                        <Icon w={5} h={5} color="inherit" as={IoIosAdd} />
                      }
                      onClick={addNetwork}
                    >
                      Add chain
                    </Button>
                  )}
                </ClientOnly>
              </Flex>
            </Flex>
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
                  {chain.infoURL.split("//").at(-1)}
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
        {/* only render rpc setction if we have an rpc for this chain */}
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
        {category && (
          <>
            <Divider />
            <ChainSectionElement colSpan={12} label="Popular Contracts">
              <SimpleGrid columns={{ base: 6, md: 12 }} gap={6} mt={2}>
                {category.contracts.map((publishedContractId, idx) => {
                  const [publisher, contractId] =
                    publishedContractId.split("/");
                  return (
                    <GridItem
                      key={contractId}
                      colSpan={{ base: 6, md: 4 }}
                      onClick={!isConfigured ? addNetwork : undefined}
                      h="full"
                      display="grid"
                    >
                      <ContractCard
                        key={publishedContractId}
                        publisher={publisher}
                        contractId={contractId}
                        tracking={{
                          source: `chain_${chain.slug}`,
                          itemIndex: `${idx}`,
                        }}
                      />
                    </GridItem>
                  );
                })}
              </SimpleGrid>
            </ChainSectionElement>
          </>
        )}
      </Container>
    </>
  );
};

interface ChainSectionElementProps extends Pick<GridItemProps, "colSpan"> {
  label: string;
  status?: "good" | "bad" | "neutral";
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
  children,
}) => {
  return (
    <GridItem colSpan={colSpan} as={Flex} flexDir="column" gap={2}>
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

const { slugToChain, chainIdToChain } = getAllChainRecords();
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

  // if the chain slug is a chain id, redirect to the chain slug
  if (chainSlug in chainIdToChain) {
    return {
      redirect: {
        destination: `/${chainIdToChain[parseInt(chainSlug)].slug}`,
        permanent: false,
      },
    };
  }

  const chain = chainSlug in slugToChain ? slugToChain[chainSlug] : null;
  if (!chain) {
    return {
      notFound: true,
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
