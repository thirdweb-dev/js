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
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { ChainIcon } from "components/icons/ChainIcon";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { useDebounce } from "hooks/common/useDebounce";
import { SearchMode, getSearchQuery } from "lib/search";
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

const typesenseApiKey =
  process.env.NEXT_PUBLIC_TYPESENSE_CONTRACT_API_KEY || "";

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

  const data = useMemo(() => {
    const potentiallyDuplicated = [...(typesenseSearchQuery.data || [])].filter(
      (d) => !!d,
    ) as ContractSearchResult[];

    // dedupe the results
    return Array.from(
      new Set(potentiallyDuplicated.map((d) => `${d.chainId}_${d.address}`)),
    ).map((chainIdAndAddress) => {
      return potentiallyDuplicated.find((d) => {
        return `${d.chainId}_${d.address}` === chainIdAndAddress;
      });
    }) as ContractSearchResult[];
  }, [typesenseSearchQuery]);

  const isFetching = useMemo(() => {
    return (
      typesenseSearchQuery.isFetching || debouncedSearchValue !== searchValue
    );
  }, [debouncedSearchValue, searchValue, typesenseSearchQuery.isFetching]);
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
                {!data || data?.length === 0 ? (
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
