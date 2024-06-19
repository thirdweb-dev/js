import { Flex, FormControl } from "@chakra-ui/react";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { UseFormReturn } from "react-hook-form";
import { FormErrorMessage, FormLabel, Heading, Text } from "tw-components";

interface RoyaltyFieldsetProps {
  form: UseFormReturn<any, any>;
}

export const RoyaltyFieldset: React.FC<RoyaltyFieldsetProps> = ({ form }) => {
  return (
    <Flex pb={4} direction="column" gap={2}>
      <Heading size="label.lg">Royalties</Heading>
      <Text size="body.md" fontStyle="italic">
        Determine the address that should receive the revenue from royalties
        earned from secondary sales of the assets.
      </Text>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <FormControl
          isRequired
          isInvalid={
            !!form.getFieldState(
              "deployParams._royaltyRecipient",
              form.formState,
            ).error
          }
        >
          <FormLabel>Recipient Address</FormLabel>
          <SolidityInput
            solidityType="address"
            variant="filled"
            {...form.register("deployParams._royaltyRecipient")}
          />
          <FormErrorMessage>
            {
              form.getFieldState(
                "deployParams._royaltyRecipient",
                form.formState,
              ).error?.message
            }
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          maxW={{ base: "100%", md: "150px" }}
          isInvalid={
            !!form.getFieldState("deployParams._royaltyBps", form.formState)
              .error
          }
          defaultValue="0"
        >
          <FormLabel>Percentage</FormLabel>
          <BasisPointsInput
            variant="filled"
            value={form.watch("deployParams._royaltyBps")}
            onChange={(value) =>
              form.setValue("deployParams._royaltyBps", value, {
                shouldTouch: true,
              })
            }
          />
          <FormErrorMessage>
            {
              form.getFieldState("deployParams._royaltyBps", form.formState)
                .error?.message
            }
          </FormErrorMessage>
        </FormControl>
      </Flex>
    </Flex>
  );
};
