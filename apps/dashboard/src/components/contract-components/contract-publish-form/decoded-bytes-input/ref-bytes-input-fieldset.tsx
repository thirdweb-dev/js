import { Button } from "@/components/ui/button";
import type { AbiParameter } from "abitype";
import { PlusIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RefBytesContractInput } from "./ref-bytes-input";

interface RefBytesInputFieldsetProps {
  param: AbiParameter;
  paramIndex: number;
  setIndex: number;
}

export const RefBytesInputFieldset: React.FC<RefBytesInputFieldsetProps> = ({
  param,
  setIndex,
  paramIndex,
}) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}.${paramIndex}.dynamicValue.refContracts`,
    control: form.control,
  });

  return (
    <div className="flex flex-col gap-5">
      {fields.map((item, index) => (
        <RefBytesContractInput
          key={item.id}
          remove={remove}
          index={index}
          param={param}
          paramIndex={paramIndex}
          setIndex={setIndex}
          className="border-border border-b pb-6"
        />
      ))}

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
          Add reference contracts for this parameter
        </p>
      </div>
    </div>
  );
};
