import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { AbiParameter } from "abitype";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { RefBytesInputFieldset } from "./ref-bytes-input-fieldset";

interface DecodedInputProps {
  param: AbiParameter;
  paramIndex: number;
  setIndex: number;
  className?: string;
}

export const DecodedInput: React.FC<DecodedInputProps> = ({
  param,
  paramIndex,
  setIndex,
  className,
}) => {
  const form = useFormContext();
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const selectedType = form.watch(
    `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}.${paramIndex}.type`,
  );

  // Toggle function to handle custom input visibility and reset fields
  const handleToggleCustomInput = (newVal: boolean) => {
    setIsCustomAddress(newVal);
    const path =
      `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}.${paramIndex}` as const;

    if (newVal) {
      form.setValue(`${path}.dynamicValue.type`, selectedType);
      form.resetField(`${path}.defaultValue`);
    } else {
      form.setValue(`${path}.dynamicValue.type`, "");
      form.resetField(`${path}.dynamicValue`);
    }
  };

  const showDynamicInputToggle =
    selectedType === "address" || selectedType === "address[]";

  return (
    <div className={className}>
      {/* Type */}
      <FormFieldSetup
        isRequired={true}
        label="Parameter Type"
        errorMessage={
          form.getFieldState(
            `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}.${paramIndex}.type`,
            form.formState,
          ).error?.message
        }
      >
        <Select
          {...form.register(
            `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}.${paramIndex}.type`,
          )}
          onValueChange={(v) => {
            form.setValue(
              `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}.${paramIndex}.type`,
              v,
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="address">address</SelectItem>
            <SelectItem value="bool">bool</SelectItem>
            <SelectItem value="bytes32">bytes32</SelectItem>
            <SelectItem value="string">string</SelectItem>
            <SelectItem value="uint256"> uint256 </SelectItem>
          </SelectContent>
        </Select>
      </FormFieldSetup>

      <div className="h-5" />

      {/* Value */}
      <div className="flex justify-between gap-4">
        <h5>Parameter Value</h5>
        {showDynamicInputToggle && (
          <div className="flex items-center gap-3 text-sm">
            Dynamic Input
            <Switch
              checked={isCustomAddress}
              onCheckedChange={(v) => handleToggleCustomInput(!!v)}
            />
          </div>
        )}
      </div>

      <div className="h-2" />

      <div>
        {isCustomAddress ? (
          <RefBytesInputFieldset
            param={param}
            setIndex={setIndex}
            paramIndex={paramIndex}
          />
        ) : (
          <Input
            placeholder="Enter value"
            {...form.register(
              `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}.${paramIndex}.defaultValue`,
            )}
            disabled={selectedType === "address" && isCustomAddress}
          />
        )}
      </div>
    </div>
  );
};
