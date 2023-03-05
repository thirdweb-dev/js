import {
  Box,
  ButtonGroup,
  Divider,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import {
  QueryClient,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Chain } from "@thirdweb-dev/chains";
import { useAddress } from "@thirdweb-dev/react";
import { fetchEns } from "components/contract-components/hooks";
import { ChainIcon } from "components/icons/ChainIcon";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { useConfiguredChains } from "hooks/chains/configureChains";
import { useDebounce } from "hooks/common/useDebounce";
import { isPossibleEVMAddress } from "lib/address-utils";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK } from "lib/sdk";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiSearch, FiX } from "react-icons/fi";
import invariant from "tiny-invariant";
import { Button, Card, Heading, Link, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

type ContractSearchResult = {
  address: string;
  chainId: number;
  metadata: { name: string; image?: string; symbol?: string };
  needsImport: boolean;
};

const TRACKING_CATEGORY = "any_contract_search";

function onChainContractSearchQuery(
  searchQuery: string,
  chain: Chain,
  queryClient: QueryClient,
  trackEvent: ReturnType<typeof useTrack>,
) {
  return {
    queryKey: [
      "onchain-contract-search",
      { chainId: chain.chainId, search: searchQuery },
    ],
    queryFn: async () => {
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "attempt",
        searchQuery,
      });
      if (!isPossibleEVMAddress(searchQuery)) {
        throw new Error("Not a valid EVM address");
      }
      let address = searchQuery;
      // if it's an ens address first resolve the real address
      if (searchQuery?.endsWith(".eth")) {
        const ensResult = await fetchEns(queryClient, searchQuery);
        if (!ensResult.address) {
          throw new Error("Failed to resolve ENS name.");
        }
        address = ensResult.address;
      }
      // create a new sdk for the given chain (this is cached inside the helper FN so should be fine to just do)
      const chainSdk = getEVMThirdwebSDK(
        chain.chainId,
        getDashboardChainRpc(chain),
      );

      // check if there is anything on that chain at the address
      const chainProvider = chainSdk.getProvider();
      let chainCode: string;
      try {
        chainCode = await chainProvider.getCode(address);
      } catch (err) {
        // if we fail to get the code just return null
        return null;
      }

      const chainHasContract = chainCode && chainCode !== "0x";
      //  if there's no contract on the chain we can skip it and return null
      if (!chainHasContract) {
        return null;
      }
      // if there is a contract we now want to try to resolve it, if we can resolve it then we'll return the contract info, otherwise it needs to be imported
      let result: ContractSearchResult;
      try {
        const contract = await chainSdk.getContract(address);
        try {
          const metadata = await contract.metadata.get();
          result = {
            address,
            chainId: chain.chainId,
            metadata,
            needsImport: false,
          };
        } catch (err) {
          result = {
            address,
            chainId: chain.chainId,
            needsImport: false,
            metadata: {
              name: address,
            },
          };
        }
      } catch (err) {
        // if we can't resolve the contract we need to import it
        result = {
          address,
          chainId: chain.chainId,
          needsImport: true,
          metadata: {
            name: address,
          },
        };
      }
      return result;
    },
    enabled:
      isPossibleEVMAddress(searchQuery) && !!chain?.chainId && !!queryClient,
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    refetchOnMount: false,
    retry: 0,
    onSuccess: (d: unknown) => {
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "success",
        searchQuery,
        response: d,
      });
    },
    onError: (err: unknown) => {
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "failure",
        searchQuery,
        error: err,
      });
    },
  };
}

const typesenseApiKey =
  process.env.NEXT_PUBLIC_TYPESENSE_CONTRACT_API_KEY || "";

const getSearchQuery = ({
  query,
  walletAddress = "",
  searchMode = "all",
  page = 1,
  perPage = 10,
}: {
  query: string;
  walletAddress?: string;
  searchMode: SearchMode;
  page?: number;
  perPage?: number;
}) => {
  const baseUrl = new URL(
    "https://search.thirdweb.com/collections/contracts/documents/search",
  );
  baseUrl.searchParams.set("q", query);
  baseUrl.searchParams.set(
    "query_by",
    "name,symbol,contract_address,deployer_address",
  );
  baseUrl.searchParams.set("query_by_weights", "3,3,2,1");
  baseUrl.searchParams.set("page", page.toString());
  baseUrl.searchParams.set("per_page", perPage.toString());
  baseUrl.searchParams.set("exhaustive_search", "true");
  baseUrl.searchParams.set(
    "sort_by",
    `testnet:asc${
      walletAddress ? `,_eval(deployer_address:${walletAddress}):desc` : ""
    }`,
  );

  if (searchMode === "mainnet") {
    baseUrl.searchParams.set("filter_by", "testnet:false");
  } else if (searchMode === "testnet") {
    baseUrl.searchParams.set("filter_by", "testnet:true");
  }
  return baseUrl.toString();
};

function contractTypesenseSearchQuery(
  searchQuery: string,
  walletAddress = "",
  searchMode: SearchMode,
  queryClient: QueryClient,
  trackEvent: ReturnType<typeof useTrack>,
) {
  return {
    queryKey: [
      "typesense-contract-search",
      { search: searchQuery, searchMode, walletAddress },
    ],
    queryFn: async () => {
      invariant(typesenseApiKey, "No typesense api key");
      invariant(queryClient, "No query client");
      invariant(searchQuery, "No search query");
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "attempt",
        searchQuery,
      });

      const res = await fetch(
        getSearchQuery({
          query: searchQuery,
          walletAddress,
          searchMode,
        }),
        {
          headers: {
            "x-typesense-api-key": typesenseApiKey,
          },
        },
      );
      const result = await res.json();
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "attempt",
        searchQuery,
      });
      return result.hits.map((hit: any) => {
        const document = hit.document;
        return {
          address: document.contract_address,
          chainId: document.chain_id,
          metadata: {
            name: document.name,
          },
        } as ContractSearchResult;
      }) as ContractSearchResult[];
    },
    enabled: !!searchQuery && !!queryClient && !!typesenseApiKey,
    onSuccess: (d: unknown) => {
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "success",
        searchQuery,
        response: d,
      });
    },
    onError: (err: unknown) => {
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "failure",
        searchQuery,
        error: err,
      });
    },
    keepPreviousData: true,
  };
}

function useContractSearch(searchQuery: string) {
  const queryClient = useQueryClient();
  const configureChains = useConfiguredChains();
  const trackEvent = useTrack();
  return useQueries({
    queries: configureChains.map((chain) => {
      return onChainContractSearchQuery(
        searchQuery,
        chain,
        queryClient,
        trackEvent,
      );
    }),
  });
}

type SearchMode = "all" | "mainnet" | "testnet";

export const CmdKSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("mainnet");
  const trackEvent = useTrack();
  const queryClient = useQueryClient();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open_) => !open_);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const [searchValue, setSearchValue] = useState("");

  const walletAddress = useAddress();

  // debounce 500ms
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const typesenseSearchQuery = useQuery<ContractSearchResult[]>(
    contractTypesenseSearchQuery(
      debouncedSearchValue,
      walletAddress,
      searchMode,
      queryClient,
      trackEvent,
    ),
  );
  const searchQueryResponses = useContractSearch(debouncedSearchValue);

  const data = useMemo(() => {
    const potentiallyDuplicated = [
      ...(typesenseSearchQuery.data || []),
      ...searchQueryResponses.map((r) => r.data),
    ].filter((d) => !!d) as ContractSearchResult[];

    // dedupe the results
    return Array.from(
      new Set(potentiallyDuplicated.map((d) => `${d.chainId}_${d.address}`)),
    ).map((chainIdAndAddress) => {
      return potentiallyDuplicated.find((d) => {
        return `${d.chainId}_${d.address}` === chainIdAndAddress;
      });
    }) as ContractSearchResult[];
  }, [searchQueryResponses, typesenseSearchQuery]);

  const isFetching = useMemo(() => {
    return (
      typesenseSearchQuery.isFetching ||
      debouncedSearchValue !== searchValue ||
      searchQueryResponses.some((r) => r.isFetching)
    );
  }, [
    debouncedSearchValue,
    searchQueryResponses,
    searchValue,
    typesenseSearchQuery.isFetching,
  ]);

  const error = useMemo(() => {
    return !isFetching && !data.length
      ? searchQueryResponses.find((r) => r.error)?.error
      : undefined;
  }, [data.length, isFetching, searchQueryResponses]);

  const [activeIndex, setActiveIndex] = useState(0);

  const router = useRouter();

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchValue("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    // re-set the active index if we are fetching
    if (isFetching && !data.length) {
      setActiveIndex(0);
    }
  }, [data.length, isFetching]);

  useEffect(() => {
    // only if the modal is open
    if (!open) {
      return;
    }
    const down = (e: KeyboardEvent) => {
      // if something is selected and we press enter or space we should go to the contract
      if (e.key === "Enter" && data) {
        const result = data[activeIndex];
        if (result) {
          e.preventDefault();
          router.push(
            `/${result.chainId}/${result.address}${
              result.needsImport ? "?import=true" : ""
            }`,
          );
          trackEvent({
            category: TRACKING_CATEGORY,
            action: "select_contract",
            input_mode: "keyboard",
            chainId: result.chainId,
            contract_address: result.address,
          });
          handleClose();
        }
      } else if (e.key === "ArrowDown") {
        // if we press down we should move the selection down
        e.preventDefault();
        setActiveIndex((aIndex) => {
          if (data) {
            return Math.min(aIndex + 1, data.length - 1);
          }
          return aIndex;
        });
      } else if (e.key === "ArrowUp") {
        // if we press up we should move the selection up
        e.preventDefault();
        setActiveIndex((aIndex) => Math.max(aIndex - 1, 0));
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [activeIndex, data, handleClose, open, router, trackEvent]);

  return (
    <>
      <InputGroup
        display={{ base: "none", lg: "block" }}
        minW="300px"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Input
          borderRadius="md"
          fontSize="var(--tw-font-size-body-md)"
          borderColor="borderColor"
          placeholder="Search any contract"
        />
        <InputRightElement w="auto" pr={2} as={Flex} gap={1}>
          <Text size="body.sm" color="chakra-placeholder-color">
            ⌘K
          </Text>
        </InputRightElement>
      </InputGroup>
      <IconButton
        aria-label="Search any contract"
        variant="ghost"
        display={{ base: "inherit", lg: "none" }}
        icon={<Icon as={FiSearch} />}
        onClick={() => setOpen(true)}
      />

      {/* modal below here */}
      <Modal size="lg" isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <Card bg="backgroundCard" as={ModalContent} p={0}>
          <InputGroup size="lg">
            <InputLeftElement>
              <Icon as={FiSearch} />
            </InputLeftElement>
            <Input
              bg="transparent!important"
              autoFocus
              border="none"
              borderRadius="none"
              placeholder="Search any contract"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <InputRightElement>
              {isFetching ? (
                <Spinner size="sm" />
              ) : searchValue.length > 0 ? (
                <IconButton
                  size="sm"
                  aria-label="Clear search"
                  variant="ghost"
                  icon={<Icon as={FiX} />}
                  onClick={() => setSearchValue("")}
                />
              ) : null}
            </InputRightElement>
          </InputGroup>

          {searchValue.length > 0 && (!isFetching || data.length) ? (
            <Flex px={2} direction="column">
              <Divider borderColor="borderColor" />

              <ButtonGroup size="xs" my={2}>
                <Button
                  variant={searchMode === "all" ? "solid" : "ghost"}
                  onClick={() => {
                    setSearchMode("all");
                  }}
                >
                  All
                </Button>
                <Button
                  variant={searchMode === "mainnet" ? "solid" : "ghost"}
                  onClick={() => {
                    setSearchMode("mainnet");
                  }}
                >
                  Mainnet
                </Button>
                <Button
                  variant={searchMode === "testnet" ? "solid" : "ghost"}
                  onClick={() => {
                    setSearchMode("testnet");
                  }}
                >
                  Testnet
                </Button>
              </ButtonGroup>

              <Flex py={2}>
                {error ? (
                  <Text
                    p={3}
                    color="red.400"
                    _light={{ color: "red.600" }}
                    size="label.md"
                  >
                    {(error as Error).message}
                  </Text>
                ) : !data || data?.length === 0 ? (
                  <Text p={3} size="label.md">
                    No contracts found.
                  </Text>
                ) : (
                  <Flex direction="column" w="full">
                    {data.map((result, idx) => {
                      return (
                        <SearchResult
                          key={`${result.chainId}_${result.address}`}
                          result={result}
                          isActive={idx === activeIndex}
                          onClick={() => {
                            handleClose();
                            trackEvent({
                              category: TRACKING_CATEGORY,
                              action: "select_contract",
                              input_mode: "click",
                              chainId: result.chainId,
                              contract_address: result.address,
                            });
                          }}
                          onMouseEnter={() => setActiveIndex(idx)}
                        />
                      );
                    })}
                  </Flex>
                )}
              </Flex>
            </Flex>
          ) : null}
        </Card>
      </Modal>
    </>
  );
};

interface SearchResultProps {
  result: ContractSearchResult;
  isActive: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

const SearchResult: React.FC<SearchResultProps> = ({
  result,
  isActive,
  onMouseEnter,
  onClick,
}) => {
  const { chainIdToChainRecord } = useAllChainsData();

  const chain = chainIdToChainRecord[result.chainId];

  // not able to resolve chain...
  if (!chain) {
    return null;
  }
  return (
    <Flex
      as={LinkBox}
      gap={4}
      align="center"
      _dark={{
        bg: isActive ? "rgba(255,255,255,.05)" : "transparent",
      }}
      _light={{
        bg: isActive ? "rgba(0,0,0,.05)" : "transparent",
      }}
      borderRadius="md"
      w="100%"
      p={3}
    >
      <Box flexShrink={0}>
        <ChainIcon size={24} ipfsSrc={chain?.icon?.url} />
      </Box>
      <Flex direction="column">
        <LinkOverlay
          textDecor="none!important"
          as={Link}
          href={`/${chain.slug}/${result.address}${
            result.needsImport ? "?import=true" : ""
          }`}
          onMouseEnter={onMouseEnter}
          onClick={onClick}
          size="label.xl"
        >
          <Heading as="h3" size="label.lg">
            {shortenIfAddress(result.metadata.name)}
          </Heading>
        </LinkOverlay>
        <Heading pointerEvents="none" as="h4" opacity={0.6} size="subtitle.xs">
          {chain.name} - {shortenIfAddress(result.address)}
        </Heading>
      </Flex>
      <Flex ml="auto" align="center" gap={3} flexShrink={0}>
        <Icon as={FiArrowRight} />
      </Flex>
    </Flex>
  );
};
