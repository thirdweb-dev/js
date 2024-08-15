import type { StoredChain } from "contexts/configured-chains";
import { useTrack } from "hooks/analytics/useTrack";
import { useAddRecentlyUsedChainId } from "hooks/chains/recentlyUsedChains";
import { useModifyChain } from "hooks/chains/useModifyChain";
import { useEditChain } from "hooks/networkConfigModal";
import { toast } from "sonner";
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

  const handleSubmit = (chain: StoredChain) => {
    modifyChain(chain);
    addRecentlyUsedChainId(chain.chainId);

    if (chain.isCustom) {
      if (props.onNetworkAdded) {
        props.onNetworkAdded(chain);
      }

      trackChainConfig("add", chain);
      toast.success("Network Added Successfully");
    } else {
      if (props.onNetworkConfigured) {
        props.onNetworkConfigured(chain);
      }

      trackChainConfig("update", chain);
      toast.success("Network Updated Successfully");
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold tracking-tight mb-5">
        {editChain ? "Edit Network" : "Add Custom Network"}
      </h3>

      {/* Modify the given chain */}
      {editChain && (
        <ConfigureNetworkForm
          editingChain={editChain}
          onSubmit={handleSubmit}
        />
      )}

      {/* Custom chain */}
      {!editChain && (
        <ConfigureNetworkForm
          prefillSlug={props.prefillSlug}
          prefillChainId={props.prefillChainId}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
