import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AbiParameter } from "abitype";
import { PlusIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RefContractInput } from "./ref-input";

interface RefInputFieldsetProps {
  param: AbiParameter;
}

export const RefInputFieldset: React.FC<RefInputFieldsetProps> = ({
  param,
}) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `constructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts`,
    control: form.control,
  });
  const hideAddButton = param.type === "address" && fields.length >= 1;

  return (
    <div className="flex flex-col gap-5">
      {fields.map((item, index) => (
        <RefContractInput
          key={item.id}
          remove={remove}
          index={index}
          param={param}
          className={cn(!hideAddButton && "border-border border-b pb-5")}
        />
      ))}

      {!hideAddButton && (
        <div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() =>
              append({
                contractId: "",
                version: "",
                publisherAddress: "",
                salt: "",
              })
            }
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
