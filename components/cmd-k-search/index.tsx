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
import { QueryClient, useQueries, useQueryClient } from "@tanstack/react-query";
import { Chain } from "@thirdweb-dev/chains";
import { fetchEns } from "components/contract-components/hooks";
import { ChainIcon } from "components/icons/ChainIcon";
import { useTrack } from "hooks/analytics/useTrack";
import { useConfiguredChains } from "hooks/chains/configureChains";
import { isPossibleEVMAddress } from "lib/address-utils";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK } from "lib/sdk";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiSearch, FiX } from "react-icons/fi";
import { Card, Heading, Link, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

type ContractSearchResult = {
  address: string;
  chain: Chain;
  metadata: { name: string; image?: string; symbol?: string };
  needsImport: boolean;
};

const TRACKING_CATEGORY = "any_contract_search";

function contractSearchQuery(
  searchQuery: string,
  chain: Chain,
  queryClient: QueryClient,
  trackEvent: ReturnType<typeof useTrack>,
) {
  return {
    queryKey: [
      "contract-search",
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
      if (searchQuery.endsWith(".eth")) {
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
            chain,
            metadata,
            needsImport: false,
          };
        } catch (err) {
          result = {
            address,
            chain,
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
          chain,
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

function useContractSearch(searchQuery: string) {
  const queryClient = useQueryClient();
  const configureChains = useConfiguredChains();
  const trackEvent = useTrack();
  return useQueries({
    queries: configureChains.map((chain) => {
      return contractSearchQuery(searchQuery, chain, queryClient, trackEvent);
    }),
  });
}
export const CmdKSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const trackEvent = useTrack();

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

  const searchQueryResponses = useContractSearch(searchValue);

  const data = useMemo(() => {
    return searchQueryResponses
      .map((r) => r.data)
      .filter((d) => !!d) as ContractSearchResult[];
  }, [searchQueryResponses]);

  const isFetching = useMemo(() => {
    return searchQueryResponses.some((r) => r.isFetching);
  }, [searchQueryResponses]);

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
      if ((e.key === " " || e.key === "Enter") && data) {
        const result = data[activeIndex];
        if (result) {
          e.preventDefault();
          router.push(
            `/${result.chain.slug}/${result.address}${
              result.needsImport ? "?import=true" : ""
            }`,
          );
          trackEvent({
            category: TRACKING_CATEGORY,
            action: "select_contract",
            input_mode: "keyboard",
            chain: result.chain,
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
        display={{ base: "none", md: "block" }}
        minW="300px"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Input
          borderRadius="md"
          fontSize="var(--tw-font-size-body-md)"
          borderColor="borderColor"
          placeholder="Contract Address or ENS name"
        />
        <InputRightElement w="auto" pr={2} as={Flex} gap={1}>
          <Text size="body.sm" color="chakra-placeholder-color">
            ⌘K
          </Text>
        </InputRightElement>
      </InputGroup>
      <IconButton
        aria-label="Contract Address or ENS name"
        variant="ghost"
        display={{ base: "inherit", md: "none" }}
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
              placeholder="Contract Address or ENS name"
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
                {error ? (
                  <Text
                    p={3}
                    color="red.400"
                    _light={{ color: "red.600" }}
                    size="label.md"
                  >
                    {(error as Error).message}
                  </Text>
                ) : !isPossibleEVMAddress(searchValue) ? (
                  <Text p={3} size="label.md">
                    Please enter a valid contract address or ENS name.
                  </Text>
                ) : !data || data?.length === 0 ? (
                  <Text p={3} size="label.md">
                    No contracts found.
                  </Text>
                ) : (
                  <Flex direction="column" w="full">
                    {data.map((result, idx) => {
                      return (
                        <Flex
                          as={LinkBox}
                          key={result.chain.chainId}
                          gap={4}
                          align="center"
                          _dark={{
                            bg:
                              idx === activeIndex
                                ? "rgba(255,255,255,.05)"
                                : "transparent",
                          }}
                          _light={{
                            bg:
                              idx === activeIndex
                                ? "rgba(0,0,0,.05)"
                                : "transparent",
                          }}
                          borderRadius="md"
                          w="100%"
                          p={3}
                        >
                          <Box flexShrink={0}>
                            <ChainIcon
                              size={24}
                              ipfsSrc={result.chain?.icon?.url}
                            />
                          </Box>
                          <Flex direction="column">
                            <LinkOverlay
                              textDecor="none!important"
                              as={Link}
                              href={`/${result.chain.slug}/${result.address}${
                                result.needsImport ? "?import=true" : ""
                              }`}
                              size="label.xl"
                              onClick={() => {
                                handleClose();
                                trackEvent({
                                  category: TRACKING_CATEGORY,
                                  action: "select_contract",
                                  input_mode: "click",
                                  chain: result.chain,
                                  contract_address: result.address,
                                });
                              }}
                              onMouseEnter={() => setActiveIndex(idx)}
                            >
                              <Heading as="h3" size="label.lg">
                                {shortenIfAddress(result.metadata.name)}
                              </Heading>
                            </LinkOverlay>
                            <Heading
                              pointerEvents="none"
                              as="h4"
                              opacity={0.6}
                              size="subtitle.xs"
                            >
                              {result.chain.name}
                            </Heading>
                          </Flex>
                          <Flex ml="auto" align="center" gap={3} flexShrink={0}>
                            <Icon as={FiArrowRight} />
                          </Flex>
                        </Flex>
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
