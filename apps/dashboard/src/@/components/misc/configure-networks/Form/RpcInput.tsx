import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import type { NetworkConfigFormData } from "../ConfigureNetworkForm";

export const RpcInput: React.FC<{
  form: UseFormReturn<NetworkConfigFormData>;
}> = ({ form }) => {
  const rpcUrlId = useId();
  const reg = form.register("rpcUrl", {
    required: true,
    validate: {
      isValidUrl: (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
    },
  });

  return (
    <FormFieldSetup
      errorMessage={form.formState.errors.rpcUrl?.message}
      htmlFor={rpcUrlId}
      isRequired
      label="RPC URL"
    >
      <Input
        autoComplete="off"
        className="bg-card"
        id={rpcUrlId}
        placeholder="https://"
        type="url"
        {...reg}
      />

      <p className="mt-2 text-muted-foreground text-sm leading-normal">
        Only add RPC URL that you trust. Malicious RPCs can record activity and
        lie about the state of the network.
      </p>
    </FormFieldSetup>
  );
};
