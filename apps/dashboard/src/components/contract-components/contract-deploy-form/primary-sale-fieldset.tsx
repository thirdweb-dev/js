import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { Fieldset } from "./common";

interface PrimarySaleFieldsetProps {
  isInvalid: boolean;
  register: UseFormRegisterReturn;
  errorMessage: string | undefined;
  client: ThirdwebClient;
}

export const PrimarySaleFieldset: React.FC<PrimarySaleFieldsetProps> = (
  props,
) => {
  return (
    <Fieldset legend="Primary Sales">
      <FormFieldSetup
        label="Recipient Address"
        errorMessage={props.errorMessage}
        isRequired
        helperText={
          <>
            The wallet address that should receive the revenue from initial
            sales of the assets.
          </>
        }
      >
        <SolidityInput
          solidityType="address"
          {...props.register}
          client={props.client}
        />
      </FormFieldSetup>
    </Fieldset>
  );
};
