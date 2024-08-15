import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { StoredChain } from "contexts/configured-chains";
import { useSetEditChain } from "hooks/networkConfigModal";
import { ConfigureNetworks } from "./ConfigureNetworks";

interface AddNetworkModalProps {
  onClose: () => void;
  onNetworkAdded?: (chain: StoredChain) => void;
}

export const ConfigureNetworkModal: React.FC<AddNetworkModalProps> = (
  props,
) => {
  const setEditChain = useSetEditChain();
  const onModalClose = () => {
    props.onClose();
    setEditChain(undefined);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(v) => {
        if (!v) {
          onModalClose();
        }
      }}
    >
      <DialogContent
        className="p-0 z-[10001] max-w-[480px]"
        dialogOverlayClassName="z-[10000]"
      >
        <ConfigureNetworks
          onNetworkAdded={(chain) => {
            props.onNetworkAdded?.(chain);
            onModalClose();
          }}
          onNetworkConfigured={onModalClose}
        />
      </DialogContent>
    </Dialog>
  );
};
