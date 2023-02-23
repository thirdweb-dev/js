import {
  Box,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  useOutsideClick,
} from "@chakra-ui/react";
import { Chain } from "@thirdweb-dev/chains";
import { ChainIcon } from "components/icons/ChainIcon";
import Fuse from "fuse.js";
import { useAllChainsData } from "hooks/chains/allChains";
import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { RefCallBack } from "react-hook-form";
import { BiChevronDown } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { Badge, FormErrorMessage, FormLabel, Text } from "tw-components";

interface SearchNetworksProps {
  onNetworkSelection: (network: Chain, custom: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement> | RefCallBack;
  errorMessage?: string;
  value: string;
  onChange: (value: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
  onCustomClick: (name: string) => void;
}

export const SearchNetworks: React.FC<SearchNetworksProps> = (props) => {
  const { allChains } = useAllChainsData();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchTerm = props.value;

  useOutsideClick({
    ref: searchContainerRef,
    handler: () => {
      props.setIsSearchOpen(false);
    },
  });

  const fuse = useMemo(() => {
    return new Fuse(allChains, {
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
    });
  }, [allChains]);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredChains = useMemo(() => {
    if (!deferredSearchTerm || !allChains.length) {
      return allChains || [];
    }

    return fuse.search(deferredSearchTerm).map((e) => e.item);
  }, [allChains, deferredSearchTerm, fuse]);

  const { onChange, setIsSearchOpen, onNetworkSelection } = props;

  const handleSelection = useCallback(
    (network: Chain, custom: boolean) => {
      onChange(network.name);
      setIsSearchOpen(false);
      onNetworkSelection(network, custom);
    },
    [onChange, setIsSearchOpen, onNetworkSelection],
  );

  const isFocusSet = useRef(false);
  useEffect(() => {
    if (isFocusSet.current || !searchContainerRef.current) {
      return;
    }

    const input = searchContainerRef.current.querySelector("input");
    if (input) {
      // timeout used to mvoe focus from Modal's close button
      setTimeout(() => {
        input.focus();
      });
      isFocusSet.current = true;
    }
  });

  return (
    <Box>
      <FormControl
        isInvalid={!!props.errorMessage}
        isRequired
        ref={searchContainerRef}
      >
        <FormLabel>Network Name</FormLabel>

        <InputGroup position="relative">
          <Input
            spellCheck="false"
            onClick={() => {
              props.setIsSearchOpen(true);
            }}
            ref={props.inputRef}
            _placeholder={{
              fontWeight: 500,
            }}
            bg={props.isSearchOpen ? "backgroundHighlight" : "inputBg"}
            type="text"
            autoComplete="off"
            placeholder="Search by Name or Chain ID"
            aria-label="Search Network"
            value={searchTerm}
            outline="none"
            py={5}
            borderBottomLeftRadius={props.isSearchOpen ? 0 : "md"}
            borderBottomRightRadius={props.isSearchOpen ? 0 : "md"}
            onChange={(e) => {
              props.onChange(e.target.value);
              if (!props.isSearchOpen) {
                props.setIsSearchOpen(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                // if search results, select first
                // else select custom
                if (filteredChains.length > 0) {
                  handleSelection(filteredChains[0], false);
                } else if (searchTerm) {
                  props.onCustomClick(searchTerm);
                }
              }
            }}
          />

          {/* Spinner Icon as a Searching Indicator */}
          {searchTerm !== deferredSearchTerm && (
            <InputRightElement
              opacity={!props.isSearchOpen || !searchTerm ? 0 : 1}
              transition="opacity 250ms ease"
              cursor={"pointer"}
              mr={14}
              borderRadius="md"
              children={<Spinner size="sm" />}
            />
          )}

          {/*  Icon for clearning the input */}
          <InputRightElement
            opacity={!props.isSearchOpen || !searchTerm ? 0 : 1}
            transition="opacity 250ms ease"
            cursor={"pointer"}
            mr={7}
            borderRadius="md"
            children={
              <IconButton
                bg="transparent"
                w={6}
                h={6}
                minW={6}
                _hover={{
                  bg: "transparent",
                }}
                icon={
                  <Icon
                    _dark={{
                      color: "accent.700",
                    }}
                    _light={{
                      color: "accent.700",
                    }}
                    as={IoMdClose}
                  />
                }
                aria-label="clear"
              ></IconButton>
            }
            onClick={() => {
              props.onChange("");
              searchContainerRef.current?.querySelector("input")?.focus();
            }}
          />

          {/* Toggle for opening and closing the list */}
          <InputRightElement
            cursor={"pointer"}
            transition="transform 200ms ease"
            transform={props.isSearchOpen ? "rotate(180deg)" : "rotate(0deg)"}
            children={
              <IconButton
                bg="transparent"
                w={6}
                h={6}
                minW={6}
                _hover={{
                  bg: "transparent",
                }}
                icon={<Icon as={BiChevronDown} />}
                aria-label={props.isSearchOpen ? "close" : "open"}
              ></IconButton>
            }
            onClick={() => {
              props.setIsSearchOpen(!props.isSearchOpen);
            }}
          />
        </InputGroup>

        {/* Results */}
        <Box
          display={props.isSearchOpen ? "block" : "none"}
          borderRadius={"md"}
          borderTopLeftRadius={0}
          borderTopRightRadius={0}
          position="absolute"
          zIndex={10}
          bg="backgroundHighlight"
          boxShadow={"0 16px 32px rgba(0,0,0,0.15)"}
          w="100%"
        >
          <Box
            maxH={{ base: "275px", md: "300px" }}
            minH="150px"
            sx={{
              maskImage:
                "linear-gradient(to bottom, black 80%, transparent 100%)",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "inputBgHover",
                borderRadius: 24,
              },
            }}
            overflowY="auto"
            borderTop="1px solid"
            borderColor="accent.100"
            pt={4}
            pb={4}
          >
            {allChains.length === 0 && (
              <Flex justifyContent="center" alignItems="center" h="90%">
                <Spinner size="md" />
              </Flex>
            )}
            {allChains.length > 0 && (
              <SearchResults
                chains={filteredChains}
                onSelect={handleSelection}
              />
            )}

            {allChains.length > 0 && filteredChains.length === 0 && (
              <Text py={10} textAlign="center">
                No Results Found
              </Text>
            )}
          </Box>

          {/* create custom */}
          {deferredSearchTerm && (
            <Flex
              _hover={{
                background: "inputBgHover",
              }}
              cursor="pointer"
              onClick={() => props.onCustomClick(searchTerm)}
              alignItems="center"
              p={4}
              justifyContent="space-between"
              borderTop="1px solid"
              borderColor="inputBg"
            >
              <Text color="heading"> {searchTerm} </Text>
              <Badge
                colorScheme="blue"
                px={2}
                py={1}
                lineHeight="1"
                borderRadius="md"
              >
                Create Custom
              </Badge>
            </Flex>
          )}
        </Box>

        <FormErrorMessage> {props.errorMessage} </FormErrorMessage>
      </FormControl>
    </Box>
  );
};

export const SearchResults: React.FC<{
  chains: Chain[];
  onSelect: (network: Chain, custom: boolean) => void;
}> = memo(function SearchResults(props) {
  return (
    <>
      {props.chains.map((network) => (
        <Text
          px={4}
          py={2}
          key={network.name}
          cursor="pointer"
          display="flex"
          gap={3}
          color="heading"
          _hover={{
            background: "inputBgHover",
          }}
          onClick={() => {
            props.onSelect(network, false);
          }}
        >
          <ChainIcon ipfsSrc={network.icon?.url} size={20} />
          {network.name}{" "}
          <Text as="span" opacity={0.8} ml="auto" color="inherit">
            {network.chainId}
          </Text>
        </Text>
      ))}
    </>
  );
});
