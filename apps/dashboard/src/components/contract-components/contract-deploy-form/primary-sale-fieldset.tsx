import { Flex, FormControl } from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FormErrorMessage, FormLabel, Heading, Text } from "tw-components";

interface PrimarySaleFieldsetProps {
  isInvalid: boolean;
  register: UseFormRegisterReturn;
  errorMessage: string | undefined;
}

export const PrimarySaleFieldset: React.FC<PrimarySaleFieldsetProps> = (
  props,
) => {
  return (
    <Flex pb={4} direction="column" gap={2}>
      <Heading size="label.lg">Primary Sales</Heading>
      <Text size="body.md" fontStyle="italic">
        Determine the address that should receive the revenue from initial sales
        of the assets.
      </Text>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <FormControl isRequired isInvalid={props.isInvalid}>
          <FormLabel>Recipient Address</FormLabel>
          <SolidityInput
            solidityType="address"
            variant="filled"
            {...props.register}
          />
          <FormErrorMessage>{props.errorMessage}</FormErrorMessage>
        </FormControl>
      </Flex>
    </Flex>
  );
};
