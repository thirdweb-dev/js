import type { UseFormRegisterReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { BasisPointsInput } from "@/components/blocks/BasisPointsInput";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "@/components/solidity-inputs";
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
  client: ThirdwebClient;
}) {
  const bpsNumValue = Number.parseInt(props.royaltyBps.value);
  return (
    <Fieldset legend="Royalties">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <FormFieldSetup
            className="grow"
            errorMessage={props.royaltyRecipient.errorMessage}
            helperText={
              <>
                The wallet address that should receive the revenue from
                royalties earned from secondary sales of the assets.
              </>
            }
            isRequired
            label="Recipient Address"
          >
            <SolidityInput
              solidityType="address"
              {...props.royaltyRecipient.register}
              client={props.client}
            />
          </FormFieldSetup>

          <FormFieldSetup
            className="shrink-0 md:max-w-[150px]"
            errorMessage={props.royaltyBps.errorMessage}
            isRequired
            label="Percentage"
          >
            <BasisPointsInput
              defaultValue={0}
              onChange={(value) => props.royaltyBps.setValue(value.toString())}
              value={Number.isNaN(bpsNumValue) ? 0 : bpsNumValue}
            />
          </FormFieldSetup>
        </div>

        {props.transferValidator && (
          <FormFieldSetup
            errorMessage={props.transferValidator.errorMessage}
            helperText={
              <>
                The contract address to enforce royalties according to the
                Creator Token Standard implementation. Passing the zero address
                disables this validation.
              </>
            }
            isRequired
            label="Transfer Validator Address"
          >
            <SolidityInput
              solidityType="address"
              {...props.transferValidator.register}
              client={props.client}
            />
          </FormFieldSetup>
        )}
      </div>
    </Fieldset>
  );
}
