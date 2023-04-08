import { Box, Flex, IconButton, Spinner } from "@chakra-ui/react";
import { NetworkSelectorProps } from "@thirdweb-dev/react";
import { ChainIcon } from "components/icons/ChainIcon";
import { useAddRecentlyUsedChainId } from "hooks/chains/recentlyUsedChains";
import {
  useSetEditChain,
  useSetIsNetworkConfigModalOpen,
} from "hooks/networkConfigModal";
import { RxGear } from "react-icons/rx";

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

  return (
    <Flex
      w="100%"
      justifyContent="start"
      bg="inputBg"
      _hover={{
        bg: "inputBgHover",
      }}
      borderRadius="md"
      px={3}
      cursor="pointer"
      h="auto"
      minH="56px"
    >
      <Flex role="group" flexGrow={1} alignItems="center">
        <Flex
          onClick={() => {
            switchChain();
          }}
          flexGrow={1}
          gap={4}
          alignItems="center"
        >
          <ChainIcon ipfsSrc={chain.icon?.url} size={32} />
          <Flex gap={2} flexDir="column" alignItems="start" py={3}>
            {chain.name}
            {switching && (
              <Flex
                color="blue.500"
                fontSize="14px"
                alignItems="center"
                gap={2}
              >
                Confirm in your wallet
                <Spinner size="sm" />
              </Flex>
            )}

            {switchFailed && (
              <Box color="red.500" fontSize="14px">
                Error switching network
              </Box>
            )}
          </Flex>
        </Flex>

        <IconButton
          aria-label="Configure Network"
          ml="auto"
          p={1}
          variant="ghost"
          _hover={{
            bg: "inputBgHover",
          }}
          opacity={0}
          _groupHover={{
            opacity: 1,
          }}
          icon={<RxGear />}
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
