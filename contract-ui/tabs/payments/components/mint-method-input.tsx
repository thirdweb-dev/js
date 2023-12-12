import {
  Box,
  Flex,
  FormControl,
  Icon,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { Abi } from "@thirdweb-dev/sdk";
import { AbiSelector } from "components/contract-components/contract-publish-form/abi-selector";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { FiChevronDown } from "react-icons/fi";
import {
  Heading,
  Text,
  FormLabel,
  Button,
  FormErrorMessage,
  MenuItem,
} from "tw-components";

interface PaymentsMintMethodInputProps {
  abi: Abi;
  form: any;
}

export const PaymentsMintMethodInput: React.FC<
  PaymentsMintMethodInputProps
> = ({ abi, form }) => {
  const filteredAbi = abi.filter((f) =>
    f.inputs.some((i) => i.type === "address"),
  );

  return (
    <Flex flexDir="column" gap={2} w="full">
      {filteredAbi.length === 0 ? (
        <Text>
          This contract doesn&apos;t have any function that can be used as Mint
          Method. Please use a different contract.
        </Text>
      ) : (
        <AbiSelector
          defaultValue="initialize"
          abi={filteredAbi}
          value={form.watch(`mintFunctionName`)}
          onChange={(selectedFn) =>
            form.setValue(`mintFunctionName`, selectedFn)
          }
        />
      )}
      {form.watch(`mintFunctionName`) && (
        <Flex flexDir="column" gap={2} mt={2}>
          {abi
            .find((fn) => fn.name === form.watch(`mintFunctionName`))
            ?.inputs.map((input) => {
              return (
                <FormControl
                  key={input.name}
                  isRequired
                  as={Flex}
                  justifyContent="space-between"
                  alignItems={
                    input.type.endsWith("[]") ? "flex-start" : "center"
                  }
                  isInvalid={
                    !!form.formState.errors?.[`mintFunctionArgs.${input.name}`]
                  }
                >
                  <FormLabel my={1} minW={36} isTruncated>
                    {input.name}
                  </FormLabel>

                  <Box position="relative">
                    <SolidityInput
                      {...form.register(`mintFunctionArgs.${input.name}`, {
                        required: input.type.includes("string"),
                      })}
                      type="text"
                      solidityType={input.type}
                      pr={16}
                    />
                    {(input.type === "address" ||
                      input.type.includes("int")) && (
                      <Menu>
                        {({ isOpen }) => (
                          <>
                            <MenuButton
                              w={8}
                              h={8}
                              pt={1}
                              isActive={isOpen}
                              as={Button}
                              position="absolute"
                              right={1}
                              top={1}
                              px={0}
                            >
                              <Icon as={FiChevronDown} />
                            </MenuButton>
                            <MenuList zIndex={100}>
                              <Text
                                maxW={64}
                                px={3}
                                py={2}
                                borderBottomWidth={1}
                                borderBottomColor="borderColor"
                              >
                                Enter <code>{input.name}</code> argument&apos;s
                                value or select a suggested variable:
                              </Text>
                              <MenuItem
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
                              >
                                <Flex flexDir="column" gap={1}>
                                  <Heading fontFamily="mono" size="label.md">
                                    {input.type === "address"
                                      ? "$WALLET"
                                      : "$QUANTITY"}
                                  </Heading>
                                  <Text>
                                    {input.type === "address"
                                      ? "The buyer's wallet address."
                                      : "The amount of this token to mint."}
                                  </Text>
                                </Flex>
                              </MenuItem>
                            </MenuList>
                          </>
                        )}
                      </Menu>
                    )}
                  </Box>
                  {form.formState.errors?.[`mintFunctionArgs.${input.name}`]
                    ?.message && (
                    <FormErrorMessage>
                      {
                        form.formState.errors?.[
                          `mintFunctionArgs.${input.name}`
                        ].message
                      }
                    </FormErrorMessage>
                  )}
                </FormControl>
              );
            })}
        </Flex>
      )}
    </Flex>
  );
};
