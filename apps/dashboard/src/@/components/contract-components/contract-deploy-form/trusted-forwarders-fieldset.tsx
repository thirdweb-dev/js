import type { ThirdwebClient } from "thirdweb";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "@/components/solidity-inputs";
import { Fieldset } from "./common";
import type {
  CustomContractDeploymentForm,
  DynamicValue,
} from "./custom-contract";

interface TrustedForwardersFieldsetProps {
  form: CustomContractDeploymentForm;
  client: ThirdwebClient;
}

export const TrustedForwardersFieldset: React.FC<
  TrustedForwardersFieldsetProps
> = ({ form, client }) => {
  const isDynamicValue = (val: string | DynamicValue): val is DynamicValue => {
    return typeof val === "object" && val !== null && "dynamicValue" in val;
  };

  const value = form.watch("deployParams._trustedForwarders");
  return (
    <>
      {!isDynamicValue(value) && (
        <Fieldset legend="Gasless">
          <FormFieldSetup
            errorMessage={
              form.getFieldState(
                "deployParams._trustedForwarders",
                form.formState,
              ).error?.message
            }
            helperText={
              <>
                <span className="mb-1 block text-muted-foreground text-sm">
                  Trusted forwarder addresses to enable ERC-2771 transactions
                  (i.e. gasless).
                </span>

                <span className="block text-muted-foreground text-sm">
                  You can provide your own forwarder.
                </span>
              </>
            }
            isRequired
            label="Trusted Forwarders"
          >
            <SolidityInput
              client={client}
              solidityType="address[]"
              value={value}
              {...form.register("deployParams._trustedForwarders")}
            />
          </FormFieldSetup>
        </Fieldset>
      )}
    </>
  );
};
