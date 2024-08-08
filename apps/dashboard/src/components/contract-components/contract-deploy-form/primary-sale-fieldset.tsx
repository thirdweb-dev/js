import { FormControl } from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FormErrorMessage, FormLabel } from "tw-components";

interface PrimarySaleFieldsetProps {
  isInvalid: boolean;
  register: UseFormRegisterReturn;
  errorMessage: string | undefined;
}

export const PrimarySaleFieldset: React.FC<PrimarySaleFieldsetProps> = (
  props,
) => {
  return (
    <div>
      <h3 className="text-lg mb-1 font-semibold">Primary Sales</h3>

      <p className="text-muted-foreground text-sm mb-3">
        The wallet address that should receive the revenue from initial sales of
        the assets.
      </p>

      <FormControl isRequired isInvalid={props.isInvalid}>
        <FormLabel>Recipient Address</FormLabel>
        <SolidityInput
          solidityType="address"
          variant="filled"
          {...props.register}
        />
        <FormErrorMessage>{props.errorMessage}</FormErrorMessage>
      </FormControl>
    </div>
  );
};
