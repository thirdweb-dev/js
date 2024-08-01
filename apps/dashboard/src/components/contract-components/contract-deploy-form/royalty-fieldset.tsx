import { Flex, FormControl } from "@chakra-ui/react";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FormErrorMessage, FormLabel, Heading, Text } from "tw-components";

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
    <Flex pb={4} direction="column" gap={2}>
      <Heading size="label.lg">Royalties</Heading>
      <Text size="body.md" fontStyle="italic">
        Determine the address that should receive the revenue from royalties
        earned from secondary sales of the assets.
      </Text>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
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
      </Flex>
    </Flex>
  );
}
