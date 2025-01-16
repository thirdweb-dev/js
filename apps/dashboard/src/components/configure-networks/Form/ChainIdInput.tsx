import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { NetworkConfigFormData } from "../ConfigureNetworkForm";

export const ChainIdInput: React.FC<{
  form: UseFormReturn<NetworkConfigFormData>;
  disabled: boolean;
}> = ({ form, disabled }) => {
  return (
    <FormFieldSetup
      label="Chain ID"
      htmlFor="chain-id"
      isRequired
      errorMessage={
        form.formState.errors.chainId?.type === "taken"
          ? form.formState.errors.chainId?.message
          : undefined
      }
    >
      <Input
        disabled={disabled}
        id="chain-id"
        autoComplete="off"
        className="bg-card font-mono disabled:bg-card disabled:text-muted-foreground disabled:opacity-100"
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
    </FormFieldSetup>
  );
};
