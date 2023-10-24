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
    <Flex flexDir="column" gap={8} mt={{ base: 2, md: 6 }}>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
        }}
      />
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
              placeholder="Chain name or chain id"
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
          </Flex>
        </Flex>

        <Flex flexDir="column" gap={1}>
          <Text pointerEvents="none" opacity={0.6}>
            RPC URL
          </Text>
          {chain.hasRpc ? (
            <InputGroup>
              <Input readOnly value={`${chain.slug}.rpc.thirdweb.com`} />
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
              value="Coming Soon"
            />
          )}
        </Flex>

        <SimpleGrid pointerEvents="none" gap={12} columns={2}>
          <Flex as={GridItem} flexDir="column" gap={1}>
            <Text opacity={0.6}>Chain ID</Text>
            <Text size="label.md">{chain.chainId}</Text>
          </Flex>
          <Flex as={GridItem} flexDir="column" gap={1}>
            <Text opacity={0.6}>Native Token</Text>
            <Text size="label.md">{chain.symbol}</Text>
          </Flex>
        </SimpleGrid>
      </Card>
    </LinkBox>
  );
});

ChainsLanding.getLayout = (page, props) => (
  <AppLayout {...props}>{page}</AppLayout>
);

type MinimalRPCChain = Pick<Chain, "slug" | "name" | "chainId"> & {
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
