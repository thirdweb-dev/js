import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { StoredChain } from "contexts/configured-chains";
import { useAddRecentlyUsedChainId } from "../../hooks/chains/recentlyUsedChains";
import { ConfigureNetworks } from "./ConfigureNetworks";

export type ConfigureNetworkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNetworkAdded?: (chain: StoredChain) => void;
  editChain: StoredChain | undefined;
};

export const ConfigureNetworkModal: React.FC<ConfigureNetworkModalProps> = (
  props,
) => {
  const addRecentlyUsedChains = useAddRecentlyUsedChainId();

  const onModalClose = () => {
    props.onOpenChange(false);
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent
        className="p-0 z-[10001] max-w-[480px]"
        dialogOverlayClassName="z-[10000]"
      >
        {/* TODO - remove after moving ConfigureNetworks to shadcn */}
        <ChakraProviderSetup>
          <ConfigureNetworks
            onNetworkAdded={(chain) => {
              addRecentlyUsedChains(chain.chainId);
              props.onNetworkAdded?.(chain);
              onModalClose();
            }}
            onNetworkConfigured={onModalClose}
            editChain={props.editChain}
          />
        </ChakraProviderSetup>
      </DialogContent>
    </Dialog>
  );
};
