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
import type { AbiFunction } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { replaceIpfsUrl } from "lib/sdk";
import { useEffect, useId, useMemo } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { FiPlay } from "react-icons/fi";
import { toast } from "sonner";
import {
  type ThirdwebContract,
  prepareContractCall,
  readContract,
  resolveMethod,
  toWei,
} from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { parseAbiParams, stringify } from "thirdweb/utils";
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

function formatResponseData(data: unknown): string {
  // Early exit if data is already a string,
  // otherwise JSON.stringify(data) will wrap it in extra quotes - which will affect the value for [Copy button]
  if (typeof data === "string") {
    return data;
  }
  if (typeof data === "bigint") {
    return data.toString();
  }

  if (typeof data === "object") {
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    const receipt: any = (data as any).receipt;
    if (receipt) {
      // biome-ignore lint/style/noParameterAssign: FIXME
      data = {
        to: receipt.to,
        from: receipt.from,
        transactionHash: receipt.transactionHash,
        events: receipt.events,
      };
    }
  }

  return stringify(data, null, 2);
}

function formatError(error: Error): string {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  if ((error as any).reason) {
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
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
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
          [x: string]: any;
          type: string;
          name?: string;
        }[]
      | undefined;
  }[],
) {
  const parsedParams = params
    .map((p) => (p.type === "bool" ? p.value !== "false" : p.value))
    .map((p) => {
      try {
        const parsed = JSON.parse(p as string);
        if (Array.isArray(parsed) || typeof parsed === "object") {
          return parsed;
        }
        // Return original value if its not an array or object
        return p;
      } catch {
        // JSON.parse on string will throw an error
        return p;
      }
    });
  return parsedParams;
}

interface InteractiveAbiFunctionProps {
  abiFunction: AbiFunction;
  contract: ThirdwebContract;
}

function useAsyncRead(contract: ThirdwebContract, functionName: string) {
  return useMutation(
    async ({ args, types }: { args: unknown[]; types: string[] }) => {
      const params = parseAbiParams(types, args);
      return readContract({
        contract,
        method: resolveMethod(functionName),
        params,
      });
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
        abiFunction.inputs.map((i) => ({
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
    isPending: mutationLoading,
  } = useSendAndConfirmTransaction();

  const {
    mutate: readFn,
    data: readData,
    isLoading: readLoading,
    error: readError,
  } = useAsyncRead(contract, abiFunction.name);

  const formattedReadData: string = useMemo(
    () => (readData ? formatResponseData(readData) : ""),
    [readData],
  );

  const error = isView ? readError : mutationError;

  // legitimate(?) use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (
      form.watch("params").length === 0 &&
      (abiFunction.stateMutability === "view" ||
        abiFunction.stateMutability === "pure")
    ) {
      readFn({
        args: [],
        types: [],
      });
    }
  }, [abiFunction, form, readFn]);

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
                (abiFunction.stateMutability === "view" ||
                  abiFunction.stateMutability === "pure")
              ) {
                const types = abiFunction.inputs.map((o) => o.type);
                readFn({ args: formatted, types });
              } else {
                if (!abiFunction.name) {
                  return toast.error("Cannot detect function name");
                }
                const types = abiFunction.inputs.map((o) => o.type);
                const params = parseAbiParams(types, formatted);
                const transaction = prepareContractCall({
                  contract,
                  method: resolveMethod(abiFunction.name),
                  params,
                  value: d.value ? toWei(d.value) : undefined,
                });
                mutate(transaction);
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
                      functionName={abiFunction.name}
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

          {abiFunction.stateMutability === "payable" && (
            <>
              <Divider mb="8px" />
              <FormControl gap={0.5}>
                <FormLabel>Native Token Value</FormLabel>
                <Input {...form.register("value")} />
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
                {/* biome-ignore lint/suspicious/noExplicitAny: FIXME */}
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
              {formattedReadData.startsWith("ipfs://") && (
                <Text size="label.sm">
                  <TrackedLink
                    href={replaceIpfsUrl(formattedReadData)}
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
