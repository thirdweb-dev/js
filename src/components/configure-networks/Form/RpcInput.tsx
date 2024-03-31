import { NetworkConfigFormData } from "../ConfigureNetworkForm";
import { Alert, AlertIcon, FormControl, Input } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { IoWarning } from "react-icons/io5";
import { FormErrorMessage, FormLabel } from "tw-components";

export const RpcInput: React.FC<{
  form: UseFormReturn<NetworkConfigFormData, any>;
}> = ({ form }) => {
  const reg = form.register("rpcUrl", {
    required: true,
    validate: {
      isValidUrl: (value) => {
        try {
          new URL(value);
          return true;
        } catch (e) {
          return false;
        }
      },
    },
  });

  return (
    <FormControl
      isRequired
      isInvalid={!!form.formState.errors.rpcUrl}
      isDisabled={form.watch("status") !== "active"}
    >
      <FormLabel>RPC URL</FormLabel>
      <Input
        autoComplete="off"
        placeholder="https://"
        type="url"
        _placeholder={{
          fontWeight: 500,
        }}
        {...reg}
      />

      <FormErrorMessage fontSize="12px">Invalid RPC URL</FormErrorMessage>

      <Alert bg="transparent" p={0} mt={2} fontSize="12px" color="paragraph">
        <AlertIcon as={IoWarning} color="inherit" />
        Only add custom networks that you trust. <br /> Malicious RPCs can
        record activity and lie about the state of the network.
      </Alert>
    </FormControl>
  );
};
