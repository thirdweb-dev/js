import { NetworkConfigFormData } from "../ConfigureNetworkForm";
import { FormControl, Input } from "@chakra-ui/react";
import { useAllChainsData } from "hooks/chains/allChains";
import { UseFormReturn } from "react-hook-form";
import { FormErrorMessage, FormLabel } from "tw-components";

export const ChainIdInput: React.FC<{
  form: UseFormReturn<NetworkConfigFormData, any>;
}> = ({ form }) => {
  const isCustom = form.watch("isCustom");
  const { chainIdToChainRecord } = useAllChainsData();
  const chainId = Number(form.watch("chainId"));

  return (
    <FormControl
      isRequired
      isInvalid={form.formState.errors.chainId?.type === "taken"}
    >
      <FormLabel>Chain ID</FormLabel>
      <Input
        disabled={!isCustom}
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
          validate: {
            taken: (str) => {
              // if adding a custom network, validate that the chainId is not already taken

              if (!isCustom) {
                return true;
              }
              const _chainId = Number(str);
              if (!_chainId) {
                return true;
              }

              return !(_chainId in chainIdToChainRecord);
            },
          },
        })}
      />
      <FormErrorMessage>
        Can not use ChainID {`"${chainId}"`}.
        {chainId && chainId in chainIdToChainRecord && (
          <>
            <br /> It is being used by {`"`}
            {chainIdToChainRecord[chainId].name}
            {`"`}
          </>
        )}
      </FormErrorMessage>
    </FormControl>
  );
};
