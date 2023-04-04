import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  FormControl,
} from "@chakra-ui/react";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { UseFormReturn } from "react-hook-form";
import { FormErrorMessage, FormLabel, Heading, Text } from "tw-components";

interface PlatformFeeFieldsetProps {
  form: UseFormReturn<any, any>;
}

export const PlatformFeeFieldset: React.FC<PlatformFeeFieldsetProps> = ({
  form,
}) => {
  return (
    <Accordion allowToggle>
      <AccordionItem borderColor="borderColor" borderBottom="none">
        <AccordionButton px={0}>
          <Heading size="subtitle.md" flex="1" textAlign="left">
            Advanced Configuration
          </Heading>

          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel py={4} px={0}>
          <Flex pb={4} direction="column" gap={2}>
            <Heading size="label.lg">Platform fees</Heading>

            <Text size="body.md" fontStyle="italic">
              For contract with primary sales, get additional fees for all
              primary sales that happen on this contract. (This is useful if you
              are deploying this contract for a 3rd party and want to take fees
              for your service). If this contract is a marketplace, get a
              percentage of all the secondary sales that happen on your
              contract.
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
                  !!form.getFieldState(
                    "deployParams._platformFeeBps",
                    form.formState,
                  ).error
                }
              >
                <FormLabel>Percentage</FormLabel>
                <BasisPointsInput
                  variant="filled"
                  value={form.watch("deployParams._platformFeeBps")}
                  onChange={(value) =>
                    form.setValue("deployParams._platformFeeBps", value, {
                      shouldTouch: true,
                    })
                  }
                />
                <FormErrorMessage>
                  {
                    form.getFieldState(
                      "deployParams._platformFeeBps",
                      form.formState,
                    ).error?.message
                  }
                </FormErrorMessage>
              </FormControl>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
