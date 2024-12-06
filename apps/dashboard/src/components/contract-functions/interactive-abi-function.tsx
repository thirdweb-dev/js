"use client";

import { Badge } from "@/components/ui/badge";
import { CodeClient } from "@/components/ui/code/code.client";
import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import { InlineCode } from "@/components/ui/inline-code";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import type { AbiFunction, AbiParameter } from "abitype";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { replaceIpfsUrl } from "lib/sdk";
import { ExternalLinkIcon, InfoIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type ThirdwebContract,
  prepareContractCall,
  readContract,
  resolveMethod,
  simulateTransaction,
  toSerializableTransaction,
  toWei,
} from "thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { parseAbiParams, stringify } from "thirdweb/utils";
import {
  Button,
  Card,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";

function formatResponseData(data: unknown): {
  type: "json" | "text";
  data: string;
} {
  // Early exit if data is already a string,
  // otherwise JSON.stringify(data) will wrap it in extra quotes - which will affect the value for [Copy button]
  if (typeof data === "string") {
    // "" is a valid response. For example, some token has `symbol` === ""
    if (data === "") {
      return { type: "text", data: `""` };
    }
    return { type: "text", data };
  }
  if (typeof data === "bigint") {
    return {
      type: "text",
      data: data.toString(),
    };
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

  return {
    type: "json",
    data: stringify(data, null, 2),
  };
}

function formatError(error: Error): string {
  if ((error as Error).message) {
    return (error as Error).message;
  }
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
    components: Readonly<AbiParameter[]> | undefined;
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
  return useMutation({
    mutationFn: async ({
      args,
      types,
    }: { args: unknown[]; types: string[] }) => {
      const params = parseAbiParams(types, args);
      return readContract({
        contract,
        method: resolveMethod(functionName),
        params,
      });
    },
  });
}

function useSimulateTransaction() {
  const from = useActiveAccount()?.address;
  return useMutation({
    mutationFn: async ({
      contract,
      functionName,
      params,
      value,
    }: {
      contract: ThirdwebContract;
      functionName: string;
      params: unknown[];
      value?: bigint;
    }) => {
      if (!from) {
        return toast.error("No account connected");
      }
      const transaction = prepareContractCall({
        contract,
        method: resolveMethod(functionName),
        params,
        value,
      });
      try {
        const [simulateResult, populatedTransaction] = await Promise.all([
          simulateTransaction({
            from,
            transaction,
          }),
          toSerializableTransaction({
            from,
            transaction,
          }),
        ]);
        return `--- ✅ Simulation succeeded ---
Result: ${simulateResult.length ? simulateResult.join(", ") : "Method did not return a result."}
Transaction data:
${Object.keys(populatedTransaction)
  .map((key) => {
    let _val = populatedTransaction[key as keyof typeof populatedTransaction];
    if (key === "value" && !_val) {
      _val = 0;
    }
    return `${key}: ${_val}\n`;
  })
  .join("")}`;
      } catch (err) {
        throw new Error(`--- ❌ Simulation failed ---
${(err as Error).message || ""}`);
      }
    },
  });
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
          components: "components" in i ? i.components : undefined,
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

  const [executionMode, setExecutionMode] = useState<
    "read" | "write" | "simulate"
  >(
    abiFunction.stateMutability === "view" ||
      abiFunction.stateMutability === "pure"
      ? "read"
      : "write",
  );

  const {
    mutate,
    data: mutationData,
    error: mutationError,
    isPending: mutationLoading,
  } = useSendAndConfirmTransaction();

  const {
    mutate: readFn,
    data: readData,
    isPending: readLoading,
    error: readError,
  } = useAsyncRead(contract, abiFunction.name);

  const txSimulation = useSimulateTransaction();

  const error =
    executionMode === "read"
      ? readError
      : executionMode === "write"
        ? mutationError
        : executionMode === "simulate"
          ? txSimulation.error
          : undefined;

  const data =
    executionMode === "read"
      ? readData
      : executionMode === "write"
        ? mutationData
        : executionMode === "simulate"
          ? txSimulation.data
          : undefined;

  const formattedResponseData = useMemo(
    () => (data !== undefined ? formatResponseData(data) : ""),
    [data],
  );

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

  const handleContractRead = form.handleSubmit((d) => {
    setExecutionMode("read");
    const types = abiFunction.inputs.map((o) => o.type);
    const formatted = formatContractCall(d.params);
    readFn({ args: formatted, types });
  });

  const handleContractWrite = form.handleSubmit((d) => {
    setExecutionMode("write");
    if (!abiFunction.name) {
      return toast.error("Cannot detect function name");
    }
    const types = abiFunction.inputs.map((o) => o.type);
    const formatted = formatContractCall(d.params);
    const params = parseAbiParams(types, formatted);
    const transaction = prepareContractCall({
      contract,
      method: resolveMethod(abiFunction.name),
      params,
      value: d.value ? toWei(d.value) : undefined,
    });
    mutate(transaction);
  });

  const handleContractSimulation = form.handleSubmit((d) => {
    setExecutionMode("simulate");
    if (!abiFunction.name) {
      return toast.error("Cannot detect function name");
    }
    const types = abiFunction.inputs.map((o) => o.type);
    const formatted = formatContractCall(d.params);
    const params = parseAbiParams(types, formatted);
    txSimulation.mutate({
      contract,
      params,
      functionName: abiFunction.name,
      value: d.value ? toWei(d.value) : undefined,
    });
  });

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
                      // @ts-expect-error - old types, need to update
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
              <InlineCode
                //  biome-ignore lint/suspicious/noExplicitAny: FIXME
                code={formatError(error as any)}
                className="relative w-full whitespace-pre-wrap rounded-md border border-border p-4 text-red-500"
              />
            </>
          ) : formattedResponseData ? (
            <>
              <Divider />
              <div className="flex flex-row items-center gap-2">
                <Heading size="label.sm">Output</Heading>
                {/* Show the Solidity type of the function's output */}
                {abiFunction.outputs.length > 0 && (
                  <Badge variant="default">
                    {abiFunction.outputs[0]?.type}
                  </Badge>
                )}
              </div>

              {formattedResponseData.type === "text" ? (
                <PlainTextCodeBlock code={formattedResponseData.data} />
              ) : (
                <CodeClient
                  lang={formattedResponseData.type}
                  code={formattedResponseData.data}
                />
              )}

              {/* If the result is an IPFS URI, show a handy link so that users can open it in a new tab */}
              {formattedResponseData.type === "text" &&
                formattedResponseData.data.startsWith("ipfs://") && (
                  <Text size="label.sm">
                    <TrackedLink
                      href={replaceIpfsUrl(formattedResponseData.data)}
                      isExternal
                      category="contract-explorer"
                      label="open-in-gateway"
                    >
                      Open in gateway
                    </TrackedLink>
                  </Text>
                )}
              {/* Same with the logic above but this time it's applied to traditional urls */}
              {((formattedResponseData.type === "text" &&
                formattedResponseData.data.startsWith("https://")) ||
                formattedResponseData.data.startsWith("http://")) && (
                <Link
                  href={formattedResponseData.data}
                  target="_blank"
                  className="mt-1 inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                >
                  Open link
                  <ExternalLinkIcon className="size-4" />
                </Link>
              )}
            </>
          ) : null}
        </Flex>

        <Divider mt="auto" />
        <ButtonGroup ml="auto">
          {isView ? (
            <Button
              isDisabled={!abiFunction}
              rightIcon={<PlayIcon className="size-4" />}
              colorScheme="primary"
              isLoading={readLoading}
              onClick={handleContractRead}
              form={formId}
            >
              Run
            </Button>
          ) : (
            <>
              <Button
                onClick={handleContractSimulation}
                isDisabled={
                  !abiFunction || txSimulation.isPending || mutationLoading
                }
                isLoading={txSimulation.isPending}
              >
                <ToolTipLabel label="Simulate the transaction to see its potential outcome without actually sending it to the network. This action doesn't cost gas.">
                  <span className="mr-3">
                    <InfoIcon className="size-5" />
                  </span>
                </ToolTipLabel>
                Simulate
              </Button>
              <TransactionButton
                disabled={
                  !abiFunction || txSimulation.isPending || mutationLoading
                }
                transactionCount={1}
                isPending={mutationLoading}
                form={formId}
                onClick={handleContractWrite}
                txChainID={contract.chain.id}
              >
                Execute
              </TransactionButton>
            </>
          )}
        </ButtonGroup>
      </Card>
    </FormProvider>
  );
};
