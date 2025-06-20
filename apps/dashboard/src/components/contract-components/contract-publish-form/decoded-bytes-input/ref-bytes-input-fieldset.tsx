import type { AbiParameter } from "abitype";
import { PlusIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { Button } from "@/components/ui/button";
import { RefBytesContractInput } from "./ref-bytes-input";

interface RefBytesInputFieldsetProps {
  param: AbiParameter;
  paramIndex: number;
  setIndex: number;
  client: ThirdwebClient;
}

export const RefBytesInputFieldset: React.FC<RefBytesInputFieldsetProps> = ({
  param,
  setIndex,
  paramIndex,
  client,
}) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}.${paramIndex}.dynamicValue.refContracts`,
  });

  return (
    <div className="flex flex-col gap-5">
      {fields.map((item, index) => (
        <RefBytesContractInput
          className="border-border border-b pb-6"
          client={client}
          index={index}
          key={item.id}
          param={param}
          paramIndex={paramIndex}
          remove={remove}
          setIndex={setIndex}
        />
      ))}

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
          Add reference contracts for this parameter
        </p>
      </div>
    </div>
  );
};
