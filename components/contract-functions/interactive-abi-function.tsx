import {
  ButtonGroup,
  Code,
  Divider,
  Flex,
  FormControl,
  Icon,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useContractWrite } from "@thirdweb-dev/react";
import { AbiFunction, ValidContractInstance } from "@thirdweb-dev/sdk/evm";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BigNumber, utils } from "ethers";
import { useEffect, useId, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FiPlay } from "react-icons/fi";
import {
  Button,
  Card,
  CodeBlock,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
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

type FunctionComponents = {
  name: string;
  type: string;
  [key: string]: any;
}[];

function formatInputType(type: string, components?: FunctionComponents): any {
  if (type.includes("[]")) {
    const obj = [];
    obj.push(formatInputType(type.replace("[]", ""), components));
    return obj;
  } else if (type.includes("tuple")) {
    const obj: any = {};
    components?.forEach((component) => {
      obj[component.name] = formatInputType(
        component.type,
        component.components,
      );
    });
    return obj;
  } else if (type.includes("string")) {
    return "...";
  } else if (type.includes("int")) {
    return 0;
  } else if (type.includes("bool")) {
    return true;
  } else if (type.includes("address")) {
    return "0x...";
  } else {
    return "0";
  }
}

function formatHint(type: string, components?: FunctionComponents): string {
  const placeholder = formatInputType(type, components);
  return JSON.stringify(placeholder)
    ?.replaceAll(",", ", ")
    .replaceAll(":", ": ")
    .replaceAll("{", "{ ")
    .replaceAll("}", " }");
}

export function formatError(error: Error): string {
  if (error.message) {
    return error.message.split("| Raw error |\n")[0].trim();
  }

  try {
    return JSON.stringify(error);
  } catch {
    return error.toString();
  }
}

function formatContractCall(params: unknown[], value?: BigNumber) {
  const parsedParams = params.map((p) => {
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
  contract: ValidContractInstance;
}

export const InteractiveAbiFunction: React.FC<InteractiveAbiFunctionProps> = ({
  abiFunction,
  contract,
}) => {
  const formId = useId();
  const { register, control, getValues, watch, handleSubmit } = useForm({
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
    control,
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
    error,
    isLoading: mutationLoading,
  } = useContractWrite(contract, abiFunction?.name);

  useEffect(() => {
    if (
      watch("params").length === 0 &&
      (abiFunction?.stateMutability === "view" ||
        abiFunction?.stateMutability === "pure")
    ) {
      mutate([]);
    }
  }, [mutate, watch, abiFunction?.stateMutability]);

  return (
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
        onSubmit={handleSubmit((d) => {
          if (d.params) {
            mutate(
              formatContractCall(
                d.params.map((p) => p.value),
                utils.parseEther(d.value),
              ),
            );
          }
        })}
      >
        {fields.length > 0 && (
          <>
            <Divider mb="8px" />
            {fields.map((item, index) => (
              <FormControl key={item.id} mb="8px">
                <Flex justify="space-between">
                  <FormLabel>{item.key}</FormLabel>
                  <Text fontSize="12px">{item.type}</Text>
                </Flex>
                {item.type.includes("tuple") || item.type.includes("[]") ? (
                  <Textarea
                    defaultValue={getValues(`params.${index}.value`)}
                    {...register(`params.${index}.value`)}
                  />
                ) : (
                  <Input
                    defaultValue={getValues(`params.${index}.value`)}
                    {...register(`params.${index}.value`)}
                  />
                )}
                {(item.type.includes("tuple") || item.type.includes("[]")) && (
                  <FormHelperText>
                    Input should be passed in JSON format - Ex:{" "}
                    {formatHint(item.type, item.components)}
                  </FormHelperText>
                )}
              </FormControl>
            ))}
          </>
        )}

        {abiFunction?.stateMutability === "payable" && (
          <>
            <Divider mb="8px" />
            <FormControl gap={0.5}>
              <FormLabel>Native Token Value</FormLabel>
              <Input {...register(`value`)} />
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
              px={4}
              py={2}
              w="full"
              borderRadius="md"
              color="red.500"
              whiteSpace="pre-wrap"
              borderWidth="1px"
              position="relative"
            >
              {formatError(error as any)}
            </Text>
          </>
        ) : data !== undefined ? (
          <>
            <Divider />
            <Heading size="label.sm">Output</Heading>
            <CodeBlock
              w="full"
              position="relative"
              language="json"
              code={formatResponseData(data)}
            />
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
            isLoading={mutationLoading}
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
  );
};
