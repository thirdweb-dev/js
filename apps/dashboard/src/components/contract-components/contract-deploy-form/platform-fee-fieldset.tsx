import { Flex, FormControl } from "@chakra-ui/react";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { FormErrorMessage, FormLabel, Heading, Text } from "tw-components";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface PlatformFeeFieldsetProps {
  form: CustomContractDeploymentForm;
}

export const PlatformFeeFieldset: React.FC<PlatformFeeFieldsetProps> = ({
  form,
}) => {
  return (
    <Flex pb={4} direction="column" gap={2}>
      <Heading size="label.lg">Platform fees</Heading>

      <Text size="body.md" fontStyle="italic">
        For contract with primary sales, get additional fees for all primary
        sales that happen on this contract. (This is useful if you are deploying
        this contract for a 3rd party and want to take fees for your service).
        If this contract is a marketplace, get a percentage of all the secondary
        sales that happen on your contract.
      </Text>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <FormControl
          isRequired
          isInvalid={
            !!form.getFieldState(
              "deployParams._platformFeeRecipient",
              form.formState,
            ).error
          }
        >
          <FormLabel>Recipient Address</FormLabel>
          <SolidityInput
            solidityType="address"
            variant="filled"
            {...form.register("deployParams._platformFeeRecipient")}
          />
          <FormErrorMessage>
            {
              form.getFieldState(
                "deployParams._platformFeeRecipient",
                form.formState,
              ).error?.message
            }
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          maxW={{ base: "100%", md: "150px" }}
          isInvalid={
            !!form.getFieldState("deployParams._platformFeeBps", form.formState)
              .error
          }
        >
          <FormLabel>Percentage</FormLabel>
          <BasisPointsInput
            variant="filled"
            value={Number(form.watch("deployParams._platformFeeBps"))}
            onChange={(value) =>
              form.setValue("deployParams._platformFeeBps", value.toString(), {
                shouldTouch: true,
              })
            }
          />
          <FormErrorMessage>
            {
              form.getFieldState("deployParams._platformFeeBps", form.formState)
                .error?.message
            }
          </FormErrorMessage>
        </FormControl>
      </Flex>
    </Flex>
  );
};
