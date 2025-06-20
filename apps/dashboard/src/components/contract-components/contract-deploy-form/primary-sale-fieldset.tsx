import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
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
        errorMessage={props.errorMessage}
        helperText={
          <>
            The wallet address that should receive the revenue from initial
            sales of the assets.
          </>
        }
        isRequired
        label="Recipient Address"
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
