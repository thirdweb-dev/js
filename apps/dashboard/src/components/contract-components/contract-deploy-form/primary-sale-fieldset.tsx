import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Fieldset } from "./common";

interface PrimarySaleFieldsetProps {
  isInvalid: boolean;
  register: UseFormRegisterReturn;
  errorMessage: string | undefined;
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
        <SolidityInput solidityType="address" {...props.register} />
      </FormFieldSetup>
      <p className="mb-3 pt-4 text-muted-foreground text-sm italic">
        A 2.5% platform fee is deducted from each primary sale price to support
        ongoing platform operations and improvements.
      </p>
    </Fieldset>
  );
};
