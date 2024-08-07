import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { Flex, FormControl, InputGroup } from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { FormErrorMessage } from "tw-components";
import { useDefaultForwarders } from "../hooks";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface TrustedForwardersFieldsetProps {
  form: CustomContractDeploymentForm;
}

export const TrustedForwardersFieldset: React.FC<
  TrustedForwardersFieldsetProps
> = ({ form }) => {
  const defaultForwarders = useDefaultForwarders();

  return (
    <fieldset>
      <legend className="text-2xl font-semibold tracking-tight mb-2">
        Trusted Forwarders
      </legend>

      <p className="text-muted-foreground text-sm mb-1">
        Trusted forwarder addresses to enable ERC-2771 transactions (i.e.
        gasless).
      </p>

      <p className="text-muted-foreground text-sm mb-3">
        You can provide your own forwarder, or click the button below to use
        default forwarders provided by thirdweb. Leave empty if not needed.
      </p>

      <FormControl
        isRequired
        isInvalid={
          !!form.getFieldState(
            "deployParams._trustedForwarders",
            form.formState,
          ).error
        }
      >
        <InputGroup size="md">
          <Flex flexDir="column" w="full">
            <SolidityInput
              value={form.watch("deployParams._trustedForwarders")}
              solidityType="address[]"
              {...form.register("deployParams._trustedForwarders")}
            />
          </Flex>
        </InputGroup>

        <ToolTipLabel label="Click to apply default trusted forwarders">
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            // size="sm"
            onClick={() =>
              form.setValue(
                "deployParams._trustedForwarders",
                JSON.stringify(defaultForwarders.data),
              )
            }
          >
            Get Default
          </Button>
        </ToolTipLabel>

        <FormErrorMessage>
          {
            form.getFieldState(
              "deployParams._trustedForwarders",
              form.formState,
            ).error?.message
          }
        </FormErrorMessage>
      </FormControl>
    </fieldset>
  );
};
