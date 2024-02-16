import { Box, Flex, IconButton, Spinner } from "@chakra-ui/react";
import { NetworkSelectorProps } from "@thirdweb-dev/react";
import { ChainIcon } from "components/icons/ChainIcon";
import { useAddRecentlyUsedChainId } from "hooks/chains/recentlyUsedChains";
import {
  useSetEditChain,
  useSetIsNetworkConfigModalOpen,
} from "hooks/networkConfigModal";
import { RxGear } from "react-icons/rx";
import { Heading, Text } from "tw-components";

export const CustomChainRenderer: NetworkSelectorProps["renderChain"] = ({
  chain,
  switchChain,
  switching,
  switchFailed,
  close,
}) => {
  const setIsOpenNetworkConfigModal = useSetIsNetworkConfigModalOpen();
  const addRecentlyUsedChain = useAddRecentlyUsedChainId();
  const setEditChain = useSetEditChain();

  const isDeprecated = chain.status === "deprecated";

  return (
    <Flex
      w="100%"
      justifyContent="start"
      _hover={{
        bg: "inputBg",
      }}
      borderRadius="md"
      p="4px 12px"
      cursor="pointer"
      h="auto"
    >
      <Flex role="group" flexGrow={1} alignItems="center">
        <Flex
          onClick={() => {
            if (!isDeprecated) {
              switchChain();
            }
          }}
          flexGrow={1}
          gap={4}
          alignItems="center"
          cursor={isDeprecated ? "not-allowed" : "pointer"}
        >
          <ChainIcon ipfsSrc={chain.icon?.url} size={32} />
          <Flex gap={1} flexDir="column" alignItems="start">
            <Flex gap={2}>
              <Text fontWeight={500} color={isDeprecated ? "faded" : "inherit"}>
                {chain.name}
              </Text>
              {isDeprecated && (
                <Flex alignItems="center">
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
                    cursor="not-allowed"
                  >
                    <Heading size="label.sm" as="label" cursor="not-allowed">
                      Deprecated
                    </Heading>
                  </Flex>
                </Flex>
              )}
            </Flex>
            {switching && (
              <Flex
                color="blue.500"
                fontSize={12}
                fontWeight={500}
                alignItems="center"
                gap={2}
              >
                Confirm in your wallet
                <Spinner size="xs" />
              </Flex>
            )}

            {switchFailed && (
              <Box color="red.500" fontSize={12} fontWeight={500}>
                Error switching network
              </Box>
            )}
          </Flex>
        </Flex>

        <IconButton
          aria-label="Configure Network"
          ml="auto"
          p={0}
          variant="ghost"
          _hover={{
            bg: "inputBg",
          }}
          lineHeight={1}
          opacity={0}
          _groupHover={{
            opacity: 1,
          }}
          icon={<RxGear width={4} height={4} />}
          onClick={() => {
            setEditChain(chain);
            addRecentlyUsedChain(chain.chainId);
            setIsOpenNetworkConfigModal(true);
            if (close) {
              close();
            } else {
              console.error("close is undefined");
            }
          }}
        />
      </Flex>
    </Flex>
  );
};
