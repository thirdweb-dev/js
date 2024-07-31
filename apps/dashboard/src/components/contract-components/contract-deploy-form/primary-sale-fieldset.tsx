import { Flex, FormControl } from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { FormErrorMessage, FormLabel, Heading, Text } from "tw-components";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface PrimarySaleFieldsetProps {
  form: CustomContractDeploymentForm;
}

export const PrimarySaleFieldset: React.FC<PrimarySaleFieldsetProps> = ({
  form,
}) => {
  return (
    <Flex pb={4} direction="column" gap={2}>
      <Heading size="label.lg">Primary Sales</Heading>
      <Text size="body.md" fontStyle="italic">
        Determine the address that should receive the revenue from initial sales
        of the assets.
      </Text>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <FormControl
          isRequired
          isInvalid={
            !!form.getFieldState("deployParams._saleRecipient", form.formState)
              .error
          }
        >
          <FormLabel>Recipient Address</FormLabel>
          <SolidityInput
            solidityType="address"
            variant="filled"
            {...form.register("deployParams._saleRecipient")}
          />
          <FormErrorMessage>
            {
              form.getFieldState("deployParams._saleRecipient", form.formState)
                .error?.message
            }
          </FormErrorMessage>
        </FormControl>
      </Flex>
    </Flex>
  );
};
