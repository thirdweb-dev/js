import type { AbiParameter } from "abitype";
import { PlusIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefContractInput } from "./ref-input";

interface RefInputFieldsetProps {
  param: AbiParameter;
  client: ThirdwebClient;
}

export const RefInputFieldset: React.FC<RefInputFieldsetProps> = ({
  param,
  client,
}) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `constructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts`,
  });
  const hideAddButton = param.type === "address" && fields.length >= 1;

  return (
    <div className="flex flex-col gap-5">
      {fields.map((item, index) => (
        <RefContractInput
          className={cn(!hideAddButton && "border-border border-b pb-5")}
          client={client}
          index={index}
          key={item.id}
          param={param}
          remove={remove}
        />
      ))}

      {!hideAddButton && (
        <div>
          <Button
            className="gap-2"
            onClick={() =>
              append({
                contractId: "",
                publisherAddress: "",
                salt: "",
                version: "",
              })
            }
            size="sm"
            type="button"
            variant="outline"
          >
            <PlusIcon className="size-4" />
            Add Reference
          </Button>
          <p className="mt-2 text-muted-foreground text-sm">
            Set Reference contract for this parameter
          </p>
        </div>
      )}
    </div>
  );
};
