import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
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
          <FormFieldSetup
            isRequired
            label="Trusted Forwarders"
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
          >
            <SolidityInput
              value={value}
              solidityType="address[]"
              {...form.register("deployParams._trustedForwarders")}
            />
          </FormFieldSetup>
        </Fieldset>
      )}
    </>
  );
};
