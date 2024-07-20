import {
  Box,
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
  type QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ChainIcon } from "components/icons/ChainIcon";
import { useTrack } from "hooks/analytics/useTrack";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiSearch, FiX } from "react-icons/fi";
import { Card, Heading, Link, Text } from "tw-components";
import { useDebounce } from "use-debounce";
import { shortenIfAddress } from "utils/usedapp-external";
import { type TrendingContract, fetchTopContracts } from "../../lib/search";

const TRACKING_CATEGORY = "any_contract_search";

const typesenseApiKey =
  process.env.NEXT_PUBLIC_TYPESENSE_CONTRACT_API_KEY || "";

function contractTypesenseSearchQuery(
  searchQuery: string,
  queryClient: QueryClient,
  trackEvent: ReturnType<typeof useTrack>,
) {
  return {
    queryKey: ["typesense-contract-search", { search: searchQuery }],
    queryFn: async () => {
      trackEvent({
        category: TRACKING_CATEGORY,
        action: "query",
        label: "attempt",
        searchQuery,
      });

      return fetchTopContracts({
        query: searchQuery,
        perPage: 10,
        timeRange: "month",
      });
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
  const trackEvent = useTrack();
  const queryClient = useQueryClient();

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
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

  // debounce 500ms
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  const typesenseSearchQuery = useQuery<TrendingContract[]>(
    contractTypesenseSearchQuery(debouncedSearchValue, queryClient, trackEvent),
  );

  const data = useMemo(() => {
    const potentiallyDuplicated = [...(typesenseSearchQuery.data || [])].filter(
      (d) => !!d,
    ) as TrendingContract[];

    // dedupe the results
    return Array.from(
      new Set(
        potentiallyDuplicated.map(
          (d) => `${d.chainMetadata.chainId}_${d.contractAddress}`,
        ),
      ),
    ).map((chainIdAndAddress) => {
      return potentiallyDuplicated.find((d) => {
        return (
          `${d.chainMetadata.chainId}_${d.contractAddress}` ===
          chainIdAndAddress
        );
      });
    }) as TrendingContract[];
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

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // re-set the active index if we are fetching
    if (isFetching && !data.length) {
      setActiveIndex(0);
    }
  }, [data.length, isFetching]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
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
            `/${result.chainMetadata.chainId}/${result.contractAddress}`,
          );
          trackEvent({
            category: TRACKING_CATEGORY,
            action: "select_contract",
            input_mode: "keyboard",
            chainId: result.chainMetadata.chainId,
            contract_address: result.contractAddress,
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
                          key={`${result.chainMetadata.chainId}_${result.contractAddress}`}
                          result={result}
                          isActive={idx === activeIndex}
                          onClick={() => {
                            handleClose();
                            trackEvent({
                              category: TRACKING_CATEGORY,
                              action: "select_contract",
                              input_mode: "click",
                              chainId: result.chainMetadata.chainId,
                              contract_address: result.contractAddress,
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
  result: TrendingContract;
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
        <ChainIcon size={24} ipfsSrc={result.chainMetadata?.icon?.url} />
      </Box>
      <Flex direction="column">
        <LinkOverlay
          textDecor="none!important"
          as={Link}
          href={`/${result.chainMetadata.chainId}/${result.contractAddress}`}
          onMouseEnter={onMouseEnter}
          onClick={onClick}
          size="label.xl"
        >
          <Heading as="h3" size="label.lg">
            {shortenIfAddress(result.name)}
          </Heading>
        </LinkOverlay>
        <Heading pointerEvents="none" as="h4" opacity={0.6} size="subtitle.xs">
          {result.chainMetadata.name} -{" "}
          {shortenIfAddress(result.contractAddress)}
        </Heading>
      </Flex>
      <Flex ml="auto" align="center" gap={3} flexShrink={0}>
        <Icon as={FiArrowRight} />
      </Flex>
    </Flex>
  );
};
