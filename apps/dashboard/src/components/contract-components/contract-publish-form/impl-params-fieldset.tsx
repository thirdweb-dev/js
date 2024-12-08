import {
  Divider,
  Flex,
  FormControl,
  InputGroup,
  InputRightElement,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { AbiParameter } from "abitype";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { getTemplateValuesForType } from "lib/deployment/template-values";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Button,
  Card,
  Checkbox,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import { RefInputImplFieldset } from "./ref-contract-impl-input/ref-input-impl-fieldset";

interface ImplementationParamsFieldsetProps {
  implParams: readonly AbiParameter[];
}
export const ImplementationParamsFieldset: React.FC<
  ImplementationParamsFieldsetProps
> = ({ implParams }) => {
  const form = useFormContext();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isCustomInputEnabled, setIsCustomInputEnabled] = useState(
    Array(implParams.length).fill(false),
  );

  const handleToggleCustomInput = (index: number) => {
    setIsCustomInputEnabled((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];

      // Clear or set values accordingly when toggling between input types
      if (updated[index]) {
        form.setValue(
          `implConstructorParams.${implParams[index]?.name || "*"}.dynamicValue.type`,
          implParams[index]?.type,
        );
        form.setValue(
          `implConstructorParams.${implParams[index]?.name || "*"}.defaultValue`,
          "",
          {
            shouldDirty: true,
          },
        );
      } else {
        form.setValue(
          `implConstructorParams.${implParams[index]?.name || "*"}.dynamicValue.type`,
          "",
        );
        form.setValue(
          `implConstructorParams.${implParams[index]?.name || "*"}.dynamicValue`,
          "",
          {
            shouldDirty: true,
          },
        );
      }
      return updated;
    });
  };

  return (
    <Flex gap={16} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Heading size="title.lg">
          Implementation Contract Constructor Parameters
        </Heading>
        <Text fontStyle="normal">
          These are the parameters users will need to fill in when deploying
          this contract.
        </Text>
      </Flex>
      <Flex flexDir="column" gap={10}>
        {implParams.map((param, idx) => {
          const paramTemplateValues = getTemplateValuesForType(param.type);
          return (
            <Flex flexDir="column" gap={6} key={`implementation_${param.name}`}>
              <Flex justify="space-between" align="center">
                {param.name ? (
                  <Heading size="title.sm">{param.name}</Heading>
                ) : (
                  <Heading size="title.sm" fontStyle="italic">
                    Unnamed param (will not be used)
                  </Heading>
                )}
                <Text size="body.sm">{param.type}</Text>
              </Flex>
              <Flex gap={6} flexDir="column">
                <Flex gap={4} flexDir={{ base: "column", md: "row" }}>
                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        `implConstructorParams.${
                          param.name ? param.name : "*"
                        }.defaultValue`,
                        form.formState,
                      ).error
                    }
                  >
                    <FormLabel as={Text}>Default Value</FormLabel>
                    <InputGroup size="md">
                      <Flex flexDir="column" w="full">
                        {!isCustomInputEnabled[idx] ? (
                          <>
                            <SolidityInput
                              solidityType={param.type}
                              placeholder={
                                isMobile ||
                                paramTemplateValues?.[0]?.value ===
                                  "{{trusted_forwarders}}"
                                  ? "Pre-filled value."
                                  : "This value will be pre-filled in the deploy form."
                              }
                              {...form.register(
                                `implConstructorParams.${
                                  param.name ? param.name : "*"
                                }.defaultValue`,
                              )}
                            />
                          </>
                        ) : (
                          <RefInputImplFieldset param={param} />
                        )}

                        {(param.type === "address" ||
                          param.type === "address[]" ||
                          param.type === "bytes" ||
                          param.type === "bytes[]") && (
                          <Checkbox
                            isChecked={isCustomInputEnabled[idx]}
                            onChange={() => handleToggleCustomInput(idx)}
                          >
                            Use Custom Input
                          </Checkbox>
                        )}
                      </Flex>
                      {paramTemplateValues.length > 0 &&
                        !isCustomInputEnabled[idx] && (
                          <InputRightElement width="10.5rem">
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
                                    {paramTemplateValues[0]?.helperText} Click
                                    to apply.
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
                                    `implConstructorParams.${
                                      param.name ? param.name : "*"
                                    }.defaultValue`,
                                    paramTemplateValues[0]?.value,
                                    {
                                      shouldDirty: true,
                                    },
                                  );
                                }}
                              >
                                {paramTemplateValues[0]?.value}
                              </Button>
                            </Tooltip>
                          </InputRightElement>
                        )}
                    </InputGroup>
                    <FormErrorMessage>
                      {
                        form.getFieldState(
                          `implConstructorParams.${
                            param.name ? param.name : "*"
                          }.defaultValue`,
                          form.formState,
                        ).error?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
              </Flex>
              {idx !== implParams.length - 1 ? <Divider mt={8} /> : null}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};
