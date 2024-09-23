import { Dialog, DialogContent } from "@/components/ui/dialog";
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
};

export const ConfigureNetworkModal: React.FC<ConfigureNetworkModalProps> = (
  props,
) => {
  const onModalClose = () => {
    props.onOpenChange(false);
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent
        className="z-[10001] max-w-[480px] p-0"
        dialogOverlayClassName="z-[10000]"
      >
        <ConfigureNetworks
          onNetworkAdded={(chain) => {
            addRecentlyUsedChainId(chain.chainId);
            props.onNetworkAdded?.(chain);
            onModalClose();
          }}
          onNetworkConfigured={onModalClose}
          editChain={props.editChain}
        />
      </DialogContent>
    </Dialog>
  );
};
