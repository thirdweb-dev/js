import { FormControl } from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";
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
    <Fieldset legend=" Primary Sales">
      <FormControl isRequired isInvalid={props.isInvalid}>
        <FormLabel>Recipient Address</FormLabel>
        <SolidityInput
          solidityType="address"
          variant="filled"
          {...props.register}
        />

        <FormErrorMessage>{props.errorMessage}</FormErrorMessage>

        <FormHelperText className="!text-sm text-muted-foreground">
          The wallet address that should receive the revenue from initial sales
          of the assets.
        </FormHelperText>
      </FormControl>
    </Fieldset>
  );
};
