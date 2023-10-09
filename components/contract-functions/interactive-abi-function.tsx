import {
  ButtonGroup,
  Code,
  Divider,
  Flex,
  FormControl,
  Icon,
  Input,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useAddress, useContractWrite } from "@thirdweb-dev/react";
import { AbiFunction, SmartContract } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { BigNumber, CallOverrides, constants, utils } from "ethers";
import { replaceIpfsUrl } from "lib/sdk";
import { useEffect, useId, useMemo } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { FiPlay } from "react-icons/fi";
import invariant from "tiny-invariant";
import {
  Button,
  Card,
  CodeBlock,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";

export function formatResponseData(data: unknown): string {
  if (BigNumber.isBigNumber(data)) {
    data = data.toString();
  }

  if (typeof data === "object") {
    const receipt: any = (data as any).receipt;
    if (receipt) {
      data = {
        to: receipt.to,
        from: receipt.from,
        transactionHash: receipt.transactionHash,
        events: receipt.events,
      };
    }
  }

  return JSON.stringify(data, null, 2);
}

export function formatError(error: Error): string {
  if ((error as any).reason) {
    return (error as any).reason;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return error.toString();
  }
}

function formatContractCall(
  params: {
    key: string;
    value: string;
    type: string;
    components:
      | {
          [x: string]: any;
          type: string;
          name?: string;
        }[]
      | undefined;
  }[],
  value?: BigNumber,
) {
  const parsedParams = params
    .map((p) =>
      p.type === "bool" ? (p.value === "false" ? false : true) : p.value,
    )
    .map((p) => {
      try {
        const parsed = JSON.parse(p as string);
        if (Array.isArray(parsed) || typeof parsed === "object") {
          return parsed;
        } else {
          // Return original value if its not an array or object
          return p;
        }
      } catch {
        // JSON.parse on string will throw an error
        return p;
      }
    });

  if (value) {
    parsedParams.push({
      value,
    });
  }

  return parsedParams;
}

interface InteractiveAbiFunctionProps {
  abiFunction?: AbiFunction;
  contract: SmartContract;
}

function useDelayedRead(
  contract: Required<SmartContract> | undefined,
  functionName?: string,
) {
  return useMutation(
    async ({ args, overrides }: { args: any[]; overrides?: CallOverrides }) => {
      invariant(contract, "Contract is required");
      invariant(functionName, "functionName is required");
      return contract?.call(functionName, args, overrides);
    },
  );
}

export const InteractiveAbiFunction: React.FC<InteractiveAbiFunctionProps> = ({
  abiFunction,
  contract,
}) => {
  const formId = useId();
  const form = useForm({
    defaultValues: {
      params:
        abiFunction?.inputs.map((i) => ({
          key: i.name || "key",
          value: "",
          type: i.type,
          components: i.components,
        })) || [],
      value: "0",
    },
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: "params",
  });

  const isView = useMemo(() => {
    return (
      !abiFunction ||
      abiFunction.stateMutability === "view" ||
      abiFunction.stateMutability === "pure"
    );
  }, [abiFunction]);
  const {
    mutate,
    data,
    error: mutationError,
    isLoading: mutationLoading,
  } = useContractWrite(contract, abiFunction?.name);

  const {
    mutate: readFn,
    data: readData,
    isLoading: readLoading,
    error: readError,
  } = useDelayedRead(contract, abiFunction?.name);

  const error = isView ? readError : mutationError;

  const connectedWalletAddress = useAddress() || constants.AddressZero;

  useEffect(() => {
    if (
      form.watch("params").length === 0 &&
      (abiFunction?.stateMutability === "view" ||
        abiFunction?.stateMutability === "pure")
    ) {
      readFn({ args: [], overrides: { from: connectedWalletAddress } });
    }
  }, [readFn, abiFunction?.stateMutability, form, connectedWalletAddress]);

  return (
    <FormProvider {...form}>
      <Card
        gridColumn={{ base: "span 12", md: "span 9" }}
        borderRadius="none"
        bg="transparent"
        border="none"
        as={Flex}
        flexDirection="column"
        gap={4}
        boxShadow="none"
        flexGrow={1}
        w="100%"
        p={0}
      >
        <Flex
          position="relative"
          w="100%"
          direction="column"
          gap={2}
          as="form"
          id={formId}
          onSubmit={form.handleSubmit((d) => {
            if (d.params) {
              const formatted = formatContractCall(d.params);
              if (
                contract &&
                (abiFunction?.stateMutability === "view" ||
                  abiFunction?.stateMutability === "pure")
              ) {
                readFn({
                  args: formatted,
                  overrides: { from: connectedWalletAddress },
                });
              } else {
                mutate({
                  args: formatted,
                  overrides: d.value
                    ? { value: utils.parseEther(d.value) }
                    : undefined,
                });
              }
            }
          })}
        >
          {fields.length > 0 && (
            <>
              <Divider mb="8px" />
              {fields.map((item, index) => {
                return (
                  <FormControl
                    key={item.id}
                    mb="8px"
                    isInvalid={
                      !!form.getFieldState(
                        `params.${index}.value`,
                        form.formState,
                      ).error
                    }
                  >
                    <Flex justify="space-between">
                      <FormLabel>{camelToTitle(item.key)}</FormLabel>
                      <Text fontSize="12px">{item.key}</Text>
                    </Flex>
                    <SolidityInput
                      solidityName={item.key}
                      solidityType={item.type}
                      solidityComponents={item.components}
                      {...form.register(`params.${index}.value`)}
                    />
                    <FormErrorMessage>
                      {
                        form.getFieldState(
                          `params.${index}.value`,
                          form.formState,
                        ).error?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                );
              })}
            </>
          )}

          {abiFunction?.stateMutability === "payable" && (
            <>
              <Divider mb="8px" />
              <FormControl gap={0.5}>
                <FormLabel>Native Token Value</FormLabel>
                <Input {...form.register(`value`)} />
                <FormHelperText>
                  The native currency value (in Ether) to send with this
                  transaction (ex: 0.01 to send 0.01 native currency).
                </FormHelperText>
              </FormControl>
            </>
          )}

          {error ? (
            <>
              <Divider />
              <Heading size="label.sm">Error</Heading>
              <Text
                borderColor="borderColor"
                as={Code}
                p={4}
                w="full"
                bgColor="backgroundHighlight"
                borderRadius="md"
                color="red.500"
                whiteSpace="pre-wrap"
                borderWidth="1px"
                position="relative"
              >
                {formatError(error as any)}
              </Text>
            </>
          ) : data !== undefined || readData !== undefined ? (
            <>
              <Divider />
              <Heading size="label.sm">Output</Heading>
              <CodeBlock
                w="full"
                position="relative"
                language="json"
                code={formatResponseData(data || readData)}
              />
              {typeof readData === "string" &&
                readData?.startsWith("ipfs://") && (
                  <Text size="label.sm">
                    <TrackedLink
                      href={replaceIpfsUrl(readData)}
                      isExternal
                      category="contract-explorer"
                      label="open-in-gateway"
                    >
                      Open in gateway
                    </TrackedLink>
                  </Text>
                )}
            </>
          ) : null}
        </Flex>

        <Divider mt="auto" />
        <ButtonGroup ml="auto">
          {isView ? (
            <Button
              isDisabled={!abiFunction}
              rightIcon={<Icon as={FiPlay} />}
              colorScheme="primary"
              isLoading={readLoading}
              type="submit"
              form={formId}
            >
              Run
            </Button>
          ) : (
            <TransactionButton
              isDisabled={!abiFunction}
              colorScheme="primary"
              transactionCount={1}
              isLoading={mutationLoading}
              type="submit"
              form={formId}
            >
              Execute
            </TransactionButton>
          )}
        </ButtonGroup>
      </Card>
    </FormProvider>
  );
};
