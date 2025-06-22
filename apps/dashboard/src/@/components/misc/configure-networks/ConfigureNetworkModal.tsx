import type { ThirdwebClient } from "thirdweb";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { addRecentlyUsedChainId, type StoredChain } from "@/stores/chainStores";
import { ConfigureNetworks } from "./ConfigureNetworks";

export type ConfigureNetworkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNetworkAdded?: (chain: StoredChain) => void;
  editChain: StoredChain | undefined;
  client: ThirdwebClient;
};

export const ConfigureNetworkModal: React.FC<ConfigureNetworkModalProps> = (
  props,
) => {
  const onModalClose = () => {
    props.onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={props.onOpenChange} open={props.open}>
      <DialogContent className="max-w-[480px] p-0">
        <ConfigureNetworks
          client={props.client}
          editChain={props.editChain}
          onNetworkAdded={(chain) => {
            addRecentlyUsedChainId(chain.chainId);
            props.onNetworkAdded?.(chain);
            onModalClose();
          }}
          onNetworkConfigured={onModalClose}
        />
      </DialogContent>
    </Dialog>
  );
};
