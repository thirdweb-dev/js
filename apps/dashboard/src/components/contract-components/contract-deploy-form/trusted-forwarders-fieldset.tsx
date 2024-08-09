import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { Flex, FormControl, InputGroup } from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useState } from "react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";
import { DynamicHeight } from "../../../@/components/ui/DynamicHeight";
import { Switch } from "../../../@/components/ui/switch";
import { useDefaultForwarders } from "../hooks";
import { Fieldset } from "./common";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface TrustedForwardersFieldsetProps {
  form: CustomContractDeploymentForm;
}

export const TrustedForwardersFieldset: React.FC<
  TrustedForwardersFieldsetProps
> = ({ form }) => {
  const defaultForwarders = useDefaultForwarders();
  const [showFull, setShowFull] = useState(false);

  return (
    <Fieldset legend="Gasless">
      <DynamicHeight>
        <FormControl
          isRequired
          isInvalid={
            !!form.getFieldState(
              "deployParams._trustedForwarders",
              form.formState,
            ).error
          }
        >
          <div className="flex gap-6 justify-between items-center">
            {/* left */}
            <div>
              <FormLabel>Trusted Forwarders</FormLabel>

              <FormHelperText className="!text-sm text-muted-foreground">
                <span className="text-muted-foreground text-sm mb-1 block">
                  Trusted forwarder addresses to enable ERC-2771 transactions
                  (i.e. gasless).
                </span>

                <span className="text-muted-foreground text-sm block">
                  You can provide your own forwarder, or click the button below
                  to use default forwarders provided by thirdweb. Leave empty if
                  not needed.
                </span>
              </FormHelperText>
            </div>
            {/* Right */}
            <Switch checked={showFull} onCheckedChange={setShowFull} />
          </div>

          <div
            className={
              !showFull
                ? "hidden"
                : "block pt-3 fade-in-0 animate-in duration-400"
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
          </div>
        </FormControl>
      </DynamicHeight>
    </Fieldset>
  );
};
