import { Input } from "@/components/ui/input";
import { FormControl } from "@chakra-ui/react";
import type { UseFormReturn } from "react-hook-form";
import { FormLabel } from "tw-components";
import type { NetworkConfigFormData } from "../ConfigureNetworkForm";

export const ChainIdInput: React.FC<{
  form: UseFormReturn<NetworkConfigFormData>;
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
