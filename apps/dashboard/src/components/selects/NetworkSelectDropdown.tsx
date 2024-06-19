import { Flex, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { ChainIcon } from "components/icons/ChainIcon";
import { StoredChain } from "contexts/configured-chains";
import { useSupportedChains } from "hooks/chains/configureChains";
import { useMemo, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { Button, MenuItem, Text } from "tw-components";

interface NetworkSelectDropdownProps {
  enabledChainIds?: number[];
  disabledChainIds?: number[];
  useCleanChainName?: boolean;
  isDisabled?: boolean;
  onSelect?: (chain: StoredChain | undefined) => void;
}

export const NetworkSelectDropdown: React.FC<NetworkSelectDropdownProps> = ({
  enabledChainIds,
  disabledChainIds,
  useCleanChainName,
  isDisabled,
  onSelect,
}) => {
  const supportedChains = useSupportedChains();

  const chains = useMemo(() => {
    // return only enabled chains if enabled chains are specified
    if (enabledChainIds && enabledChainIds.length > 0) {
      const enabledChainIdsSet = new Set(enabledChainIds);
      return supportedChains.filter((chain) =>
        enabledChainIdsSet.has(chain.chainId),
      );
    }
    // return supported chains that are not disabled if disabled chains are specified
    if (disabledChainIds && disabledChainIds.length > 0) {
      const disabledChainIdsSet = new Set(disabledChainIds);
      return supportedChains.filter(
        (chain) => !disabledChainIdsSet.has(chain.chainId),
      );
    }
    // if no enabled or disabled chains are specified, return all supported chains
    return supportedChains;
  }, [supportedChains, enabledChainIds, disabledChainIds]);

  const [selectedOption, setSelectedOption] = useState<StoredChain | undefined>(
    undefined,
  );

  const handleSelection = (option: StoredChain | undefined) => {
    setSelectedOption(option);
    onSelect?.(option);
  };

  const cleanChainName = (chainName: string) => {
    return chainName.replace("Mainnet", "");
  };

  return (
    <>
      <Flex gap={2} alignItems="center">
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={
              <BiChevronDown
                pointerEvents="none"
                style={{
                  marginLeft: "auto",
                }}
              />
            }
            bg="transparent !important"
            p={0}
            isDisabled={isDisabled}
            display="flex"
            color="secondary"
            _hover={{
              bg: "inputBg",
              color: "heading",
            }}
            variant="ghost"
            style={{
              textAlign: "left",
              justifyContent: "start",
              alignItems: "center",
              height: "32px",
            }}
            leftIcon={
              selectedOption ? (
                <ChainIcon ipfsSrc={selectedOption.icon?.url} size={24} />
              ) : undefined
            }
          >
            <Text
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              color="secondary"
              _hover={{
                color: "heading",
              }}
            >
              {!selectedOption
                ? "All Networks"
                : useCleanChainName
                  ? cleanChainName(selectedOption.name)
                  : selectedOption.name}
            </Text>
          </MenuButton>

          <MenuList overflow="auto" maxH="500px">
            <MenuItem
              p={3}
              _hover={{
                bg: "inputBg",
                color: "heading",
              }}
              onClick={() => handleSelection(undefined)}
              borderBottom="2px solid"
              borderColor="inputBg"
            >
              <Flex alignItems="center" gap={3}>
                <ChainIcon ipfsSrc={undefined} size={24} />
                All Networks
              </Flex>
            </MenuItem>

            {chains.map((chain) => (
              <MenuItem
                p={3}
                key={chain.chainId}
                _hover={{
                  bg: "inputBg",
                  color: "heading",
                }}
                onClick={() => handleSelection(chain)}
              >
                <Flex alignItems="center" gap={3}>
                  <ChainIcon ipfsSrc={chain.icon?.url} size={24} />
                  {useCleanChainName ? cleanChainName(chain.name) : chain.name}
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
    </>
  );
};
