import { CustomChainRenderer } from "./CustomChainRenderer";
import { popularChains } from "@3rdweb-sdk/react/components/popularChains";
import { useColorMode } from "@chakra-ui/react";
import {
  NetworkSelector,
  useActiveChain,
  useWallet,
} from "@thirdweb-dev/react";
import { ChainIcon } from "components/icons/ChainIcon";
import { StoredChain } from "contexts/configured-chains";
import { useSupportedChains } from "hooks/chains/configureChains";
import {
  useAddRecentlyUsedChainId,
  useRecentlyUsedChains,
} from "hooks/chains/recentlyUsedChains";
import { useSetIsNetworkConfigModalOpen } from "hooks/networkConfigModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { Button } from "tw-components";

export const NetworkSelectorButton: React.FC<{
  disabledChainIds?: number[];
  isDisabled?: boolean;
  onSwitchChain?: (chain: StoredChain) => void;
}> = (props) => {
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const recentlyUsedChains = useRecentlyUsedChains();
  const addRecentlyUsedChains = useAddRecentlyUsedChainId();
  const setIsNetworkConfigModalOpen = useSetIsNetworkConfigModalOpen();
  const { colorMode } = useColorMode();
  const supportedChains = useSupportedChains();

  const { disabledChainIds } = props;

  const chains = useMemo(() => {
    if (disabledChainIds && disabledChainIds.length > 0) {
      const disabledChainIdsSet = new Set(disabledChainIds);
      return supportedChains.filter(
        (chain) => !disabledChainIdsSet.has(chain.chainId),
      );
    }
  }, [supportedChains, disabledChainIds]);
  const chain = useActiveChain();
  const prevChain = useRef(chain);
  const { onSwitchChain } = props;

  // handle switch network done from wallet app/extension
  useEffect(() => {
    if (!chain) {
      return;
    }
    if (prevChain.current?.chainId !== chain.chainId) {
      if (onSwitchChain) {
        onSwitchChain(chain);
      }
      addRecentlyUsedChains(chain.chainId);
      prevChain.current = chain;
    }
  }, [chain, onSwitchChain, addRecentlyUsedChains]);

  const wallet = useWallet();

  return (
    <>
      <Button
        isDisabled={props.isDisabled || !wallet}
        display="flex"
        bg="inputBg"
        _hover={{
          bg: "inputBgHover",
        }}
        width="100%"
        variant="solid"
        style={{
          textAlign: "left",
          justifyContent: "start",
          alignItems: "center",
          gap: "0.5rem",
        }}
        onClick={() => {
          setShowNetworkSelector(true);
        }}
        leftIcon={<ChainIcon ipfsSrc={chain?.icon?.url} size={20} />}
      >
        {chain?.name || "Select Network"}

        <BiChevronDown
          style={{
            marginLeft: "auto",
          }}
        />
      </Button>

      {showNetworkSelector && (
        <NetworkSelector
          theme={colorMode}
          chains={chains}
          recentChains={recentlyUsedChains}
          popularChains={popularChains}
          renderChain={CustomChainRenderer}
          onCustomClick={() => {
            setIsNetworkConfigModalOpen(true);
          }}
          onClose={() => {
            setShowNetworkSelector(false);
          }}
          onSwitch={(_chain) => {
            props.onSwitchChain?.(_chain);
            addRecentlyUsedChains(_chain.chainId);
          }}
        />
      )}
    </>
  );
};
