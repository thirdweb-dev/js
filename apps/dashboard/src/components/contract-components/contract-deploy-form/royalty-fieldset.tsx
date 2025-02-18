import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Fieldset } from "./common";

export function RoyaltyFieldset(props: {
  royaltyRecipient: {
    isInvalid: boolean;
    register: UseFormRegisterReturn;
    errorMessage: string | undefined;
  };
  royaltyBps: {
    isInvalid: boolean;
    errorMessage: string | undefined;
    value: string;
    setValue: (value: string) => void;
  };
  transferValidator?: {
    isInvalid: boolean;
    register: UseFormRegisterReturn;
    errorMessage: string | undefined;
  };
}) {
  const bpsNumValue = Number.parseInt(props.royaltyBps.value);
  return (
    <Fieldset legend="Royalties">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <FormFieldSetup
            className="grow"
            isRequired
            label="Recipient Address"
            errorMessage={props.royaltyRecipient.errorMessage}
            helperText={
              <>
                The wallet address that should receive the revenue from
                royalties earned from secondary sales of the assets.
              </>
            }
          >
            <SolidityInput
              solidityType="address"
              {...props.royaltyRecipient.register}
            />
          </FormFieldSetup>

          <FormFieldSetup
            isRequired
            label="Percentage"
            className="shrink-0 md:max-w-[150px]"
            errorMessage={props.royaltyBps.errorMessage}
          >
            <BasisPointsInput
              value={Number.isNaN(bpsNumValue) ? 0 : bpsNumValue}
              onChange={(value) => props.royaltyBps.setValue(value.toString())}
              defaultValue={0}
            />
          </FormFieldSetup>
        </div>

        {props.transferValidator && (
          <FormFieldSetup
            isRequired
            label="Transfer Validator Address"
            errorMessage={props.transferValidator.errorMessage}
            helperText={
              <>
                The contract address to enforce royalties according to the
                Creator Token Standard implementation. Passing the zero address
                disables this validation.
              </>
            }
          >
            <SolidityInput
              solidityType="address"
              {...props.transferValidator.register}
            />
          </FormFieldSetup>
        )}
      </div>
    </Fieldset>
  );
}
