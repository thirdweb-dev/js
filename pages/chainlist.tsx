import { fetchChainsFromApi } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Flex,
  GridItem,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import type { Chain } from "@thirdweb-dev/chains";
import { AppLayout } from "components/app-layouts/app";
import { ChainIcon } from "components/icons/ChainIcon";

import Fuse from "fuse.js";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { memo, useDeferredValue, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedCopyButton,
  TrackedLink,
} from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "chains";

export const ChainsLanding: ThirdwebNextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const [searchTerm, setSearchTerm] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(props.chains, {
      keys: [
        {
          name: "name",
          weight: 2,
        },
        {
          name: "chainId",
          weight: 1,
        },
      ],
      threshold: 0.2,
    });
  }, [props.chains]);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredChains = useMemo(() => {
    if (!deferredSearchTerm) {
      return props.chains || [];
    }

    return fuse
      .search(deferredSearchTerm, {
        limit: 10,
      })
      .map((e) => e.item);
  }, [props.chains, deferredSearchTerm, fuse]);

  const title = "Chainlist: RPCs, Block Explorers, Faucets";
  const description =
    "A list of EVM networks with RPCs, smart contracts, block explorers & faucets. Deploy smart contracts to all EVM chains with thirdweb.";

  return (
    <Flex flexDir="column" gap={8}>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
        }}
      />
      <PublishUpsellCard />
      <Flex direction="row" align="center" justify="space-between" gap={4}>
        <Heading size="title.lg" as="h1" flexShrink={0}>
          Chainlist
        </Heading>

        <Card
          p={0}
          w={{ base: "full", md: "40%" }}
          border="none"
          borderRadius="md"
        >
          <InputGroup>
            <InputLeftElement>
              <Icon as={FiSearch} opacity={0.5} />
            </InputLeftElement>
            <Input
              variant="outline"
              spellCheck="false"
              autoComplete="off"
              bg="transparent"
              placeholder="Chain name or chain ID"
              borderColor="borderColor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Spinner Icon as a Searching Indicator */}
            {searchTerm !== deferredSearchTerm && (
              <InputRightElement
                opacity={1}
                transition="opacity 250ms ease"
                cursor={"pointer"}
                borderRadius="md"
                children={<Spinner size="sm" />}
              />
            )}
          </InputGroup>
        </Card>
      </Flex>

      <SearchResults chains={filteredChains} />
    </Flex>
  );
};

export const PublishUpsellCard: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      borderRadius="3xl"
      border="1px solid rgba(255, 255, 255, 0.1);"
      p={{ base: 8, md: 10 }}
      gap={12}
      bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
      bgColor={colorMode === "dark" ? "transparent" : "backgroundHighlight"}
    >
      <Flex flexDir="column" gap={6}>
        <Heading>Accelerate your chain&apos;s growth</Heading>
        <Text>
          Add your EVM chain to this list and make it easy for developers to
          build on your network.
        </Text>

        <Flex gap={{ base: 3, sm: 4 }} flexDir={{ base: "column", sm: "row" }}>
          <LinkButton
            as={TrackedLink}
            {...{
              category: TRACKING_CATEGORY,
              label: "add_chain",
            }}
            bg="accent.900"
            color="accent.100"
            borderColor="accent.900"
            borderWidth="1px"
            href="https://support.thirdweb.com/other-faqs/tFbbEYCSbJ1GTeXoPs4QFw/how-to-add-your-evm-chain-to-thirdweb%E2%80%99s-chainlist-/3HMqrwyxXUFxQYaudDJffT"
            noIcon
            _hover={{
              bg: "transparent",
              color: "accent.900",
            }}
          >
            Add your chain
          </LinkButton>

          <LinkButton
            as={TrackedLink}
            {...{
              category: TRACKING_CATEGORY,
              label: "get_in_touch",
            }}
            variant="ghost"
            href="/contact-us"
            isExternal
            noIcon
            borderColor="borderColor"
            borderWidth="1px"
          >
            Get In Touch
          </LinkButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const SearchResults: React.FC<{
  chains: MinimalRPCChain[];
}> = memo(function SearchResults(props) {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      {props.chains.map((chain) => (
        <SearchResult chain={chain} key={`chain_${chain.chainId}`} />
      ))}
    </SimpleGrid>
  );
});

const SearchResult: React.FC<{
  chain: MinimalRPCChain;
}> = memo(function SearchResult({ chain }) {
  const isDeprecated = chain.status === "deprecated";

  return (
    <LinkBox
      position="relative"
      role="group"
      sx={{
        contentVisibility: "auto",
        containIntrinsicSize: "1px 195px",
      }}
    >
      <Card
        role="group"
        display="flex"
        flexDir="column"
        gap={4}
        px={5}
        // bg="transparent"
        borderColor="borderColor"
        transition="150ms border-color ease-in-out"
        _hover={{
          _dark: {
            borderColor: "white",
          },
          _light: {
            borderColor: "black",
          },
        }}
        position="relative"
        h="full"
      >
        <Flex justifyContent="space-between" align="center">
          <Flex align="center" gap={2}>
            <ChainIcon size={20} ipfsSrc={chain.iconUrl} />
            <LinkOverlay
              as={TrackedLink}
              category={TRACKING_CATEGORY}
              href={`/${chain.slug}`}
            >
              <Heading size="subtitle.sm" as="h3" noOfLines={1}>
                {chain.name}
              </Heading>
            </LinkOverlay>
            {isDeprecated && (
              <Flex
                borderRadius="full"
                align="center"
                border="1px solid"
                borderColor="borderColor"
                overflow="hidden"
                flexShrink={0}
                py={{ base: 1.5, md: 1 }}
                px={{ base: 1.5, md: 2 }}
                gap={3}
              >
                <Heading size="label.sm" as="label">
                  Deprecated
                </Heading>
              </Flex>
            )}
          </Flex>
        </Flex>

        <Flex flexDir="column" gap={1}>
          <Text
            pointerEvents="none"
            opacity={0.6}
            color={isDeprecated ? "faded" : "inherit"}
          >
            RPC URL
          </Text>
          {chain.hasRpc && !isDeprecated ? (
            <InputGroup>
              <Input
                readOnly
                value={`${chain.slug}.rpc.thirdweb.com`}
                isDisabled={isDeprecated}
              />
              <InputRightElement>
                <TrackedCopyButton
                  category={TRACKING_CATEGORY}
                  label="copy-rpc-url"
                  aria-label="Copy RPC url"
                  size="sm"
                  colorScheme={undefined}
                  value={`${chain.slug}.rpc.thirdweb.com`}
                />
              </InputRightElement>
            </InputGroup>
          ) : (
            <Input
              readOnly
              isDisabled
              pointerEvents="none"
              value="Unavailable"
            />
          )}
        </Flex>

        <SimpleGrid pointerEvents="none" gap={12} columns={2}>
          <Flex as={GridItem} flexDir="column" gap={1}>
            <Text opacity={0.6} color={isDeprecated ? "faded" : "inherit"}>
              Chain ID
            </Text>
            <Text size="label.md" color={isDeprecated ? "faded" : "inherit"}>
              {chain.chainId}
            </Text>
          </Flex>
          <Flex as={GridItem} flexDir="column" gap={1}>
            <Text opacity={0.6} color={isDeprecated ? "faded" : "inherit"}>
              Native Token
            </Text>
            <Text size="label.md" color={isDeprecated ? "faded" : "inherit"}>
              {chain.symbol}
            </Text>
          </Flex>
        </SimpleGrid>
      </Card>
    </LinkBox>
  );
});

ChainsLanding.getLayout = (page, props) => (
  <AppLayout {...props}>{page}</AppLayout>
);

type MinimalRPCChain = Pick<Chain, "slug" | "name" | "chainId" | "status"> & {
  iconUrl: string;
  symbol: string;
  hasRpc: boolean;
};

interface DashboardRPCProps {
  chains: Array<MinimalRPCChain>;
}

// server side ----------------
export const getStaticProps: GetStaticProps<DashboardRPCProps> = async () => {
  const chains = await fetchChainsFromApi();

  const minimalChains = chains
    .filter((c) => c.chainId !== 1337)
    .map((chain) => {
      let hasRpc = chain.rpc.length > 0;
      if (hasRpc) {
        try {
          const firstRpcUrl = new URL(chain.rpc[0]);
          // check if the rpc url specifically is thirdweb rpc
          hasRpc = firstRpcUrl.hostname.endsWith(".thirdweb.com");
        } catch {
          // ignore the failure, probably failed to parse the url
          hasRpc = false;
        }
      }

      return {
        slug: chain.slug,
        name: chain.name,
        chainId: chain.chainId,
        iconUrl: chain?.icon?.url || "",
        symbol: chain.nativeCurrency.symbol,
        status: chain?.status || "active",
        hasRpc,
      };
    });
  return {
    revalidate: 60,
    props: {
      chains: minimalChains,
    },
  };
};

ChainsLanding.pageId = PageId.ChainsLanding;

export default ChainsLanding;
