import { Input } from "@/components/ui/input";
import { FormControl } from "@chakra-ui/react";
import { useAllChainsData } from "hooks/chains/allChains";
import type { UseFormReturn } from "react-hook-form";
import { FormErrorMessage, FormLabel } from "tw-components";
import type { NetworkConfigFormData } from "../ConfigureNetworkForm";
import { TooltipBox } from "./TooltipBox";

export const NetworkIDInput: React.FC<{
  form: UseFormReturn<NetworkConfigFormData>;
  disabled?: boolean;
}> = ({ form, disabled }) => {
  const slug = form.watch("slug");
  const { slugToChainRecord } = useAllChainsData();

  return (
    <FormControl
      isRequired
      mt={6}
      isInvalid={form.formState.errors.slug?.type === "taken"}
    >
      <FormLabel className="!flex items-center gap-1">
        Network ID
        <TooltipBox
          content={
            <>
              Network ID is used to identify the network in the URL
              <p className="font-semibold mt-2 mb-1">Example</p>
              <p className="text-link-foreground text-xs">
                {"thirdweb.com/<network-id>/<contract-address>"}
              </p>
            </>
          }
        />
      </FormLabel>
      <Input
        disabled={disabled}
        autoComplete="off"
        placeholder="e.g. ethereum"
        onKeyDown={(e) => {
          // only allow alphanumeric characters and dashes
          if (!/^[a-z0-9-]*$/i.test(e.key)) {
            e.preventDefault();
          }
        }}
        type="text"
        {...form.register("slug", {
          required: true,
          validate: {
            taken: (_slug) => {
              if (disabled) {
                return true;
              }

              return !(_slug in slugToChainRecord);
            },
          },
        })}
      />

      <FormErrorMessage>
        Can not use Network ID {`"${slug}"`}.
        {slug && slug in slugToChainRecord && (
          <>
            {" "}
            It is being used by {`"`}
            {slugToChainRecord[slug].name}
            {`"`}
          </>
        )}
      </FormErrorMessage>
    </FormControl>
  );
};
