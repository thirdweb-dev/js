import { NetworkConfigFormData } from "../ConfigureNetworkForm";
import { FormControl, Input } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { FormLabel } from "tw-components";

export const ChainIdInput: React.FC<{
  form: UseFormReturn<NetworkConfigFormData, any>;
  disabled: boolean;
}> = ({ form, disabled }) => {
  return (
    <FormControl
      isRequired
      isInvalid={form.formState.errors.chainId?.type === "taken"}
    >
      <FormLabel>Chain ID</FormLabel>
      <Input
        disabled={disabled}
        placeholder="e.g. 152"
        autoComplete="off"
        _placeholder={{
          fontWeight: 500,
        }}
        onKeyDown={(e) => {
          // prevent typing e, +, -
          if (e.key === "e" || e.key === "+" || e.key === "-") {
            e.preventDefault();
          }
        }}
        type="number"
        {...form.register("chainId", {
          required: true,
        })}
      />
    </FormControl>
  );
};
