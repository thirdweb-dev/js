import { FormControl } from "@chakra-ui/react";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";
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
          <FormControl isRequired isInvalid={props.royaltyRecipient.isInvalid}>
            <FormLabel>Recipient Address</FormLabel>
            <SolidityInput
              solidityType="address"
              variant="filled"
              {...props.royaltyRecipient.register}
            />
            <FormErrorMessage>
              {props.royaltyRecipient.errorMessage}
            </FormErrorMessage>
            <FormHelperText className="!text-sm text-muted-foreground">
              The wallet address that should receive the revenue from royalties
              earned from secondary sales of the assets.
            </FormHelperText>
          </FormControl>
          <FormControl
            isRequired
            maxW={{ base: "100%", md: "150px" }}
            isInvalid={props.royaltyBps.isInvalid}
            defaultValue="0"
          >
            <FormLabel>Percentage</FormLabel>
            <BasisPointsInput
              variant="filled"
              value={Number.isNaN(bpsNumValue) ? 0 : bpsNumValue}
              onChange={(value) => props.royaltyBps.setValue(value.toString())}
            />
            <FormErrorMessage>{props.royaltyBps.errorMessage}</FormErrorMessage>
          </FormControl>
        </div>
        {props.transferValidator && (
          <FormControl isRequired isInvalid={props.transferValidator.isInvalid}>
            <FormLabel>Transfer Validator Address</FormLabel>
            <SolidityInput
              solidityType="address"
              variant="filled"
              {...props.transferValidator.register}
            />
            <FormErrorMessage>
              {props.transferValidator.errorMessage}
            </FormErrorMessage>
            <FormHelperText className="!text-sm text-muted-foreground">
              The contract address to enforce royalties according to the Creator
              Token Standard implementation. Passing the zero address disables
              this validation.
            </FormHelperText>
          </FormControl>
        )}
      </div>
    </Fieldset>
  );
}
