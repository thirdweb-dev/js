import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { reportChainConfigurationAdded } from "@/analytics/report";
import {
  addChainOverrides,
  addRecentlyUsedChainId,
  type StoredChain,
} from "@/stores/chainStores";
import { ConfigureNetworkForm } from "./ConfigureNetworkForm";

interface ConfigureNetworksProps {
  onNetworkConfigured?: (chain: StoredChain) => void;
  onNetworkAdded?: (chain: StoredChain) => void;
  prefillSlug?: string;
  prefillChainId?: string;
  editChain: StoredChain | undefined;
  client: ThirdwebClient;
}

export const ConfigureNetworks: React.FC<ConfigureNetworksProps> = (props) => {
  const { editChain } = props;

  const handleSubmit = (chain: StoredChain) => {
    addChainOverrides(chain);
    addRecentlyUsedChainId(chain.chainId);

    if (chain.isCustom) {
      if (props.onNetworkAdded) {
        reportChainConfigurationAdded({
          chainId: chain.chainId,
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcURLs: chain.rpc,
        });
        props.onNetworkAdded(chain);
      }

      toast.success("Network Added Successfully");
    } else {
      if (props.onNetworkConfigured) {
        props.onNetworkConfigured(chain);
      }

      toast.success("Network Updated Successfully");
    }
  };

  return (
    <div>
      <div className="px-6 pt-6">
        <h3 className="font-semibold text-xl tracking-tight">
          {editChain ? "Edit Network" : "Add Custom Network"}
        </h3>
      </div>

      <div>
        {/* Modify the given chain */}
        {editChain && (
          <ConfigureNetworkForm
            client={props.client}
            editingChain={editChain}
            onSubmit={handleSubmit}
          />
        )}

        {/* Custom chain */}
        {!editChain && (
          <ConfigureNetworkForm
            client={props.client}
            onSubmit={handleSubmit}
            prefillChainId={props.prefillChainId}
            prefillSlug={props.prefillSlug}
          />
        )}
      </div>
    </div>
  );
};
