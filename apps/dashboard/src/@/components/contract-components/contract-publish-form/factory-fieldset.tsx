import type { Abi } from "abitype";
import type { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { TabButtons } from "../../ui/tabs";
import { CustomFactory } from "./custom-factory";
import { DefaultFactory } from "./default-factory";

interface FactoryFieldsetProps {
  abi: Abi;
  setCustomFactoryAbi: Dispatch<SetStateAction<Abi>>;
  client: ThirdwebClient;
}

export const FactoryFieldset: React.FC<FactoryFieldsetProps> = ({
  abi,
  setCustomFactoryAbi,
  client,
}) => {
  const form = useFormContext();
  const tab = form.watch("deployType");

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-1">
        Factory deploy settings
      </h2>
      <p className="text-muted-foreground mb-6">
        Choose how you want to deploy your contract
      </p>

      <TabButtons
        tabs={[
          {
            name: "Default Factory",
            onClick: () => form.setValue("deployType", "autoFactory"),
            isActive: tab === "autoFactory",
          },
          {
            name: "Custom Factory (Advanced)",
            onClick: () => form.setValue("deployType", "customFactory"),
            isActive: tab === "customFactory",
          },
        ]}
      />

      <div className="h-4" />

      {form.watch("deployType") === "autoFactory" && (
        <DefaultFactory abi={abi} client={client} />
      )}

      {form.watch("deployType") === "customFactory" && (
        <CustomFactory
          client={client}
          setCustomFactoryAbi={setCustomFactoryAbi}
        />
      )}
    </div>
  );
};
