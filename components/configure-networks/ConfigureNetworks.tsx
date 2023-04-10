import { ConfigureNetworkForm } from "./ConfigureNetworkForm";
import { Box, useToast } from "@chakra-ui/react";
import { StoredChain } from "contexts/configured-chains";
import { useTrack } from "hooks/analytics/useTrack";
import { useModifyChain } from "hooks/chains/useModifyChain";
import { useEditChain } from "hooks/networkConfigModal";
import { Heading } from "tw-components";

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

  const handleEdit = (chain: StoredChain) => {
    if (props.onNetworkConfigured) {
      props.onNetworkConfigured(chain);
    }

    modifyChain(chain);
    trackChainConfig("update", chain);
    successToast("Network Updated Successfully");
  };

  const handleAdd = (chain: StoredChain) => {
    modifyChain(chain);
    trackChainConfig("add", chain);

    if (props.onNetworkAdded) {
      props.onNetworkAdded(chain);
    }

    successToast("Network Added Successfully");
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
            variant="edit"
            onSubmit={handleEdit}
          />
        </Box>
      )}

      {/* Custom chain */}
      {!editChain && (
        <ConfigureNetworkForm
          prefillSlug={props.prefillSlug}
          prefillChainId={props.prefillChainId}
          onSubmit={handleAdd}
          variant="custom"
        />
      )}
    </Box>
  );
};
