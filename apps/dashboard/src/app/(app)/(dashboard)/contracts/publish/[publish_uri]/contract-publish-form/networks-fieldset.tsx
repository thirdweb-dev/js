import { useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NetworksFieldsetProps {
  client: ThirdwebClient;
}

export const NetworksFieldset: React.FC<NetworksFieldsetProps> = ({
  client,
}) => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-1">
          Select networks
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Select the networks that your contract can be deployed to
        </p>
      </div>

      <Select
        onValueChange={(value) =>
          form.setValue("networksForDeployment.allNetworks", value === "all")
        }
        value={
          form.watch("networksForDeployment.allNetworks") ? "all" : "specific"
        }
      >
        <SelectTrigger className="w-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All networks</SelectItem>
          <SelectItem value="specific">Specific networks</SelectItem>
        </SelectContent>
      </Select>

      {!form.watch("networksForDeployment.allNetworks") && (
        <MultiNetworkSelector
          className="bg-card"
          client={client}
          onChange={(chainIds) =>
            form.setValue("networksForDeployment.networksEnabled", chainIds)
          }
          selectedChainIds={
            form.watch("networksForDeployment.networksEnabled") || []
          }
        />
      )}
    </div>
  );
};
