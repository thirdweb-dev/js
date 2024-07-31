import { Box, useToast } from "@chakra-ui/react";
import type { StoredChain } from "contexts/configured-chains";
import { useTrack } from "hooks/analytics/useTrack";
import { useAddRecentlyUsedChainId } from "hooks/chains/recentlyUsedChains";
import { useModifyChain } from "hooks/chains/useModifyChain";
import { useEditChain } from "hooks/networkConfigModal";
import { Heading } from "tw-components";
import { ConfigureNetworkForm } from "./ConfigureNetworkForm";

function useChainConfigTrack() {
  const trackEvent = useTrack();
  return (action: "add" | "update", chain: StoredChain) => {
    trackEvent({
      category: "chain_configuration",
      chain,
      action,
    });
  };
}

interface ConfigureNetworksProps {
  onNetworkConfigured?: (chain: StoredChain) => void;
  onNetworkAdded?: (chain: StoredChain) => void;
  prefillSlug?: string;
  prefillChainId?: string;
}

export const ConfigureNetworks: React.FC<ConfigureNetworksProps> = (props) => {
  const trackChainConfig = useChainConfigTrack();
  const addRecentlyUsedChainId = useAddRecentlyUsedChainId();
  const modifyChain = useModifyChain();
  const editChain = useEditChain();

  const toast = useToast();

  const successToast = (message: string) => {
    toast({
      title: message,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = (chain: StoredChain) => {
    modifyChain(chain);
    addRecentlyUsedChainId(chain.chainId);

    if (chain.isCustom) {
      if (props.onNetworkAdded) {
        props.onNetworkAdded(chain);
      }

      trackChainConfig("add", chain);
      successToast("Network Added Successfully");
    } else {
      if (props.onNetworkConfigured) {
        props.onNetworkConfigured(chain);
      }

      trackChainConfig("update", chain);
      successToast("Network Updated Successfully");
    }
  };

  return (
    <Box
      p={{ base: 4, md: 8 }}
      minH="600px"
      borderTop={{ md: "none", base: "1px solid" }}
      marginTop={{ base: 6, md: 0 }}
      borderColor="inputBg"
    >
      <Heading
        as={"h3"}
        size="label.xl"
        mb={8}
        display="flex"
        gap={2}
        alignItems="center"
      >
        {editChain ? "Edit Network" : "Add Custom Network"}
      </Heading>

      {/* Modify the given chain */}
      {editChain && (
        <Box mt={9}>
          <ConfigureNetworkForm
            editingChain={editChain}
            onSubmit={handleSubmit}
          />
        </Box>
      )}

      {/* Custom chain */}
      {!editChain && (
        <ConfigureNetworkForm
          prefillSlug={props.prefillSlug}
          prefillChainId={props.prefillChainId}
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  );
};
