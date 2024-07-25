import {
  Flex,
  FormControl,
  InputGroup,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { Button, Card, FormErrorMessage, Heading, Text } from "tw-components";
import { useDefaultForwarders } from "../hooks";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface TrustedForwardersFieldsetProps {
  form: CustomContractDeploymentForm;
}

export const TrustedForwardersFieldset: React.FC<
  TrustedForwardersFieldsetProps
> = ({ form }) => {
  const defaultForwarders = useDefaultForwarders();

  return (
    <Flex pb={4} direction="column" gap={2}>
      <Heading size="label.lg">Trusted Forwarders</Heading>

      <Text size="body.md" fontStyle="italic">
        Trusted forwarder addresses to enable ERC-2771 transactions (i.e.
        gasless). You can provide your own forwarder, or click the button below
        to use default forwarders provided by thirdweb. Leave empty if not
        needed.
      </Text>
      <Flex gap={4} direction={{ base: "column", md: "row" }} />
      <FormControl
        isRequired
        isInvalid={
          !!form.getFieldState(
            "deployParams._trustedForwarders",
            form.formState,
          ).error
        }
      >
        <InputGroup size="md">
          <Flex flexDir="column" w="full">
            <SolidityInput
              value={form.watch("deployParams._trustedForwarders")}
              solidityType="address[]"
              {...form.register("deployParams._trustedForwarders")}
            />
          </Flex>
          <InputRightElement>
            <Tooltip
              bg="transparent"
              boxShadow="none"
              shouldWrapChildren
              label={
                <Card
                  as={Flex}
                  flexDir="column"
                  gap={2}
                  bgColor="backgroundHighlight"
                  mr={10}
                >
                  <Text>Click to apply.</Text>
                </Card>
              }
            >
              <Button
                type="button"
                size="xs"
                padding="3"
                paddingY="3.5"
                mr={16}
                bgColor="bgBlack"
                color="bgWhite"
                _hover={{
                  opacity: 0.8,
                }}
                borderRadius="md"
                mt={2}
                onClick={() =>
                  form.setValue(
                    "deployParams._trustedForwarders",
                    JSON.stringify(defaultForwarders.data),
                  )
                }
              >
                Get default
              </Button>
            </Tooltip>
          </InputRightElement>
        </InputGroup>

        <FormErrorMessage>
          {
            form.getFieldState(
              "deployParams._trustedForwarders",
              form.formState,
            ).error?.message
          }
        </FormErrorMessage>
      </FormControl>
    </Flex>
  );
};
