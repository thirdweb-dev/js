import { FormControl } from "@chakra-ui/react";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FormErrorMessage, FormLabel } from "tw-components";

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
}) {
  const bpsNumValue = Number.parseInt(props.royaltyBps.value);
  return (
    <div>
      <h3 className="text-lg mb-1 font-semibold">Royalties</h3>
      <p className="text-muted-foreground text-sm mb-3">
        The wallet address that should receive the revenue from royalties earned
        from secondary sales of the assets.
      </p>
      <div className="flex flex-col gap-2 md:gap-4 md:flex-row">
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
    </div>
  );
}
