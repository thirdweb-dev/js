import { useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { Heading, Text } from "tw-components";
import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface NetworksFieldsetProps {
  fromStandard?: boolean;
  client: ThirdwebClient;
}

export const NetworksFieldset: React.FC<NetworksFieldsetProps> = ({
  fromStandard,
  client,
}) => {
  const form = useFormContext();

  return (
    <div className={cn("flex flex-col", fromStandard ? "gap-6" : "gap-4")}>
      <div className="flex flex-col gap-2">
        <Heading size={fromStandard ? "title.lg" : "title.md"}>
          Networks that your contract can be deployed to
        </Heading>
      </div>
      <div className="flex flex-col gap-2" data-required>
        <Select
          onValueChange={(value) =>
            form.setValue("networksForDeployment.allNetworks", value === "all")
          }
          value={
            form.watch("networksForDeployment.allNetworks") ? "all" : "specific"
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All networks</SelectItem>
            <SelectItem value="specific">Specific networks</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {!form.watch("networksForDeployment.allNetworks") && (
        <div className="flex flex-col gap-2">
          <Text>Please select the networks you want to enable:</Text>
          <MultiNetworkSelector
            client={client}
            onChange={(chainIds) =>
              form.setValue("networksForDeployment.networksEnabled", chainIds)
            }
            selectedChainIds={
              form.watch("networksForDeployment.networksEnabled") || []
            }
          />
        </div>
      )}
    </div>
  );
};
