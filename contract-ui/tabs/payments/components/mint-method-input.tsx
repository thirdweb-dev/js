import {
  Flex,
  FormControl,
  InputGroup,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { Abi } from "@thirdweb-dev/sdk";
import { AbiSelector } from "components/contract-components/contract-publish-form/abi-selector";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { Text, Card, FormLabel, Button, FormErrorMessage } from "tw-components";

interface PaymentsMintMethodInputProps {
  abi: Abi;
  form: any;
}

export const PaymentsMintMethodInput: React.FC<
  PaymentsMintMethodInputProps
> = ({ abi, form }) => {
  return (
    <Flex flexDir="column" gap={2} w="full">
      <AbiSelector
        defaultValue="initialize"
        abi={abi}
        value={form.watch(`mintFunctionName`)}
        onChange={(selectedFn) => form.setValue(`mintFunctionName`, selectedFn)}
      />
      {form.watch(`mintFunctionName`) && (
        <Flex flexDir="column" gap={2} mt={2}>
          {abi
            .find((fn) => fn.name === form.watch(`mintFunctionName`))
            ?.inputs.map((input) => (
              <FormControl
                key={input.name}
                isRequired
                as={Flex}
                justifyContent="space-between"
                alignItems="center"
                isInvalid={
                  !!form.formState.errors?.[`mintFunctionArgs.${input.name}`]
                }
              >
                <FormLabel minW={36}>{input.name}</FormLabel>
                <InputGroup>
                  <SolidityInput
                    {...form.register(`mintFunctionArgs.${input.name}`, {
                      required: input.type.includes("string"),
                    })}
                    type="text"
                    solidityType={input.type}
                  />
                  {(input.type === "address" || input.type.includes("int")) && (
                    <InputRightElement
                      width={input.type === "address" ? 24 : 28}
                    >
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
                          >
                            <Text>
                              {input.type === "address"
                                ? "The buyer's wallet address."
                                : "The amount of this token to mint."}{" "}
                              Click to apply.
                            </Text>
                          </Card>
                        }
                      >
                        <Button
                          size="xs"
                          padding="3"
                          paddingY="3.5"
                          onClick={() => {
                            form.setValue(
                              `mintFunctionArgs.${input.name}`,
                              input.type === "address"
                                ? "$WALLET"
                                : "$QUANTITY",
                              {
                                shouldDirty: true,
                              },
                            );
                          }}
                          bgColor="gray.700"
                          _hover={{
                            bgColor: "gray.800",
                          }}
                        >
                          {input.type === "address" ? "$WALLET" : "$QUANTITY"}
                        </Button>
                      </Tooltip>
                    </InputRightElement>
                  )}
                </InputGroup>
                <FormErrorMessage>
                  {
                    form.formState.errors?.[`mintFunctionArgs.${input.name}`]
                      ?.message
                  }
                </FormErrorMessage>
              </FormControl>
            ))}
        </Flex>
      )}
    </Flex>
  );
};
