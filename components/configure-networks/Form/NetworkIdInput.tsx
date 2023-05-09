import { NetworkConfigFormData } from "../ConfigureNetworkForm";
import { TooltipBox } from "./TooltipBox";
import { FormControl, Input } from "@chakra-ui/react";
import { useAllChainsData } from "hooks/chains/allChains";
import { UseFormReturn } from "react-hook-form";
import {
  CodeBlock,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";

export const NetworkIDInput: React.FC<{
  form: UseFormReturn<NetworkConfigFormData, any>;
  hidden: boolean;
}> = ({ form, hidden }) => {
  const isCustom = form.watch("isCustom");
  const slug = form.watch("slug");
  const { slugToChainRecord } = useAllChainsData();

  return (
    <FormControl
      hidden={hidden}
      isRequired
      mt={6}
      isInvalid={form.formState.errors.slug?.type === "taken"}
    >
      <FormLabel display="flex">
        Network ID
        <TooltipBox
          content={
            <>
              <Text color="heading" mb={4}>
                Network ID is used to identify the network in the URL{" "}
              </Text>
              <Heading fontSize="14px" mb={3}>
                Example
              </Heading>
              <CodeBlock
                fontSize="14px"
                code="thirdweb.com/<network-id>/<contract-address>"
                language="bash"
                canCopy={false}
              />
            </>
          }
        />
      </FormLabel>
      <Input
        disabled={!isCustom}
        autoComplete="off"
        placeholder="e.g. ethereum"
        _placeholder={{
          fontWeight: 500,
        }}
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
              if (!isCustom) {
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
