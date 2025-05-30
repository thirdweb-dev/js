import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ThirdwebClient } from "thirdweb";
import {
  type StoredChain,
  addRecentlyUsedChainId,
} from "../../stores/chainStores";
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
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-[480px] p-0">
        <ConfigureNetworks
          onNetworkAdded={(chain) => {
            addRecentlyUsedChainId(chain.chainId);
            props.onNetworkAdded?.(chain);
            onModalClose();
          }}
          onNetworkConfigured={onModalClose}
          editChain={props.editChain}
          client={props.client}
        />
      </DialogContent>
    </Dialog>
  );
};
