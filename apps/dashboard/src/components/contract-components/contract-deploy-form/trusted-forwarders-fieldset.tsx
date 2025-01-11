import { Flex, FormControl, InputGroup } from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";
import { Fieldset } from "./common";
import type {
  CustomContractDeploymentForm,
  DynamicValue,
} from "./custom-contract";

interface TrustedForwardersFieldsetProps {
  form: CustomContractDeploymentForm;
}

export const TrustedForwardersFieldset: React.FC<
  TrustedForwardersFieldsetProps
> = ({ form }) => {
  const isDynamicValue = (val: string | DynamicValue): val is DynamicValue => {
    return typeof val === "object" && val !== null && "dynamicValue" in val;
  };

  const value = form.watch("deployParams._trustedForwarders");
  return (
    <>
      {!isDynamicValue(value) && (
        <Fieldset legend="Gasless">
          <FormControl
            isRequired
            isInvalid={
              !!form.getFieldState(
                "deployParams._trustedForwarders",
                form.formState,
              ).error
            }
          >
            <div className="flex items-center justify-between gap-6">
              {/* left */}
              <div>
                <FormLabel>Trusted Forwarders</FormLabel>

                <FormHelperText className="!text-sm text-muted-foreground">
                  <span className="mb-1 block text-muted-foreground text-sm">
                    Trusted forwarder addresses to enable ERC-2771 transactions
                    (i.e. gasless).
                  </span>

                  <span className="block text-muted-foreground text-sm">
                    You can provide your own forwarder.
                  </span>
                </FormHelperText>
              </div>
            </div>

            <div className="fade-in-0 block animate-in pt-3 duration-400">
              <InputGroup size="md">
                <Flex flexDir="column" w="full">
                  <SolidityInput
                    value={value}
                    solidityType="address[]"
                    {...form.register("deployParams._trustedForwarders")}
                  />
                </Flex>
              </InputGroup>

              <FormErrorMessage>
                {
                  form.getFieldState(
                    "deployParams._trustedForwarders",
                    form.formState,
                  ).error?.message
                }
              </FormErrorMessage>
            </div>
          </FormControl>
        </Fieldset>
      )}
    </>
  );
};
