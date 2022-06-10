import {
  Box,
  ButtonGroup,
  Code,
  Divider,
  Flex,
  FormControl,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import {
  ChainId,
  useActiveChainId,
  useContract,
  useContractFunctions,
} from "@thirdweb-dev/react";
import { AbiFunction } from "@thirdweb-dev/sdk/dist/src/schema/contracts/custom";
import { TransactionButton } from "components/buttons/TransactionButton";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { Environment } from "components/contract-tabs/code/types";
import { BigNumber } from "ethers";
import { useId, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FiCode, FiPlay } from "react-icons/fi";
import { useMutation } from "react-query";
import {
  Button,
  Card,
  CodeBlock,
  ComboBox,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";

interface ContentOverviewProps {
  contractAddress?: string;
}

export const CustomContractCode: React.FC<ContentOverviewProps> = ({
  contractAddress,
}) => {
  const functionsQuery = useContractFunctions(contractAddress);

  const [selectedName, setSelectedName] = useState<string>(() =>
    functionsQuery.data ? functionsQuery.data[0].name : "",
  );

  const selectedFn = useMemo(() => {
    return functionsQuery.data?.find((fn) => fn.name === selectedName);
  }, [functionsQuery.data, selectedName]);

  const containerRef = useRef<HTMLDivElement>(null);

  if (functionsQuery.isError) {
    return <Box>Contract does not support generated functions</Box>;
  }

  return (
    <Flex gap={4} direction="column" w="full">
      {functionsQuery.data && contractAddress && (
        <Flex gap={3} flexDirection="column">
          <Heading size="subtitle.md">Interact with contract</Heading>
          <Card as={Flex} gap={2} flexDirection="column">
            <Flex gap={4}>
              <ComboBox
                defaultInputValue={functionsQuery.data[0].name}
                items={functionsQuery.data.map((f) => f.name)}
                onChange={(d) => {
                  setSelectedName(d);
                }}
              />

              <Box flexShrink={0} ref={containerRef} />
            </Flex>
            <InteractiveAbiFunction
              containerRef={containerRef}
              key={selectedFn?.name || "nonexsitent"}
              contractAddress={contractAddress}
              abiFunction={selectedFn}
            />
          </Card>
        </Flex>
      )}
    </Flex>
  );
};

function getChainName(chainId: number | undefined) {
  switch (chainId) {
    case ChainId.Mainnet:
      return "mainnet";
    case ChainId.Rinkeby:
      return "rinkeby";
    case ChainId.Goerli:
      return "goerli";
    case ChainId.Polygon:
      return "polygon";
    case ChainId.Mumbai:
      return "mumbai";
    case ChainId.Fantom:
      return "fantom";
    case ChainId.Avalanche:
      return "avalanche";
    default:
      return "mainnet";
  }
}
function formatResponseData(data: unknown): string {
  if (BigNumber.isBigNumber(data)) {
    data = data.toString();
  }

  // more parsing here
  return JSON.stringify(data, null, 2);
}

interface InteractiveAbiFunctionProps {
  abiFunction?: AbiFunction;
  contractAddress: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

const InteractiveAbiFunction: React.FC<InteractiveAbiFunctionProps> = ({
  abiFunction,
  contractAddress,
  containerRef,
}) => {
  const formId = useId();
  const { contract, isLoading: contractLoading } = useContract(contractAddress);

  const {
    mutate,
    data,
    error,
    isLoading: mutationLoading,
  } = useMutation(async (params: unknown[] = []) =>
    abiFunction ? await contract?.call(abiFunction.name, ...params) : undefined,
  );

  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const { register, control, getValues, handleSubmit, watch } = useForm({
    defaultValues: {
      params:
        abiFunction?.inputs.map((i) => ({
          key: i.name || "key",
          value: "",
          type: i.type,
        })) || [],
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

  const chainId = useActiveChainId();
  const chainName = getChainName(chainId);
  const [codeEnv, setCodeEnv] = useState<Environment>("javascript");

  return (
    <>
      <Portal containerRef={containerRef}>
        <ButtonGroup ml="auto">
          <Popover initialFocusRef={initialFocusRef} isLazy>
            <PopoverTrigger>
              <Button isDisabled={!abiFunction} leftIcon={<Icon as={FiCode} />}>
                Code
              </Button>
            </PopoverTrigger>
            <Card
              w="auto"
              as={PopoverContent}
              bg="backgroundCardHighlight"
              boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
              mx={4}
              maxW="2xl"
            >
              <PopoverArrow bg="backgroundCardHighlight" />
              <PopoverBody>
                <Flex gap={6} direction="column">
                  <Flex gap={3} direction="column">
                    <Heading size="label.lg">Installation</Heading>
                    <CodeSegment
                      setEnvironment={setCodeEnv}
                      environment={codeEnv}
                      isInstallCommand
                      snippet={{
                        javascript: `npm install @thirdweb-dev/sdk ethers`,
                        react: `npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers`,
                        python: `pip install thirdweb-sdk`,
                        go: `go get github.com/thirdweb-dev/go-sdk/thirdweb`,
                      }}
                    />
                  </Flex>
                  <Flex gap={3} direction="column">
                    <Heading size="label.lg">Code</Heading>
                    <CodeSegment
                      setEnvironment={setCodeEnv}
                      environment={codeEnv}
                      snippet={{
                        javascript: `import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("${chainName}");
const contract = await sdk.getContract("${contractAddress}");
const result = await contract.call("${abiFunction?.name}"${watch("params")
                          .map(
                            (f) => `, ${f.value ? `"${f.value}"` : `${f.key}`}`,
                          )
                          .join("")});
`,
                        react: `import { useContract } from "@thirdweb-dev/react";

const { contract, isLoading } = useContract("${contractAddress}");
const result = await contract.call("${abiFunction?.name}"${watch("params")
                          .map(
                            (f) => `, ${f.value ? `"${f.value}"` : `${f.key}`}`,
                          )
                          .join("")});`,
                        python: `from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("${chainName}")
contract = sdk.get_contract("${contractAddress}")
const result = await contract.call("${abiFunction?.name}"${watch("params")
                          .map(
                            (f) => `, ${f.value ? `"${f.value}"` : `${f.key}`}`,
                          )
                          .join("")});`,
                        go: `import (
  "github.com/thirdweb-dev/go-sdk/thirdweb"
)
            
sdk, err := thirdweb.NewThirdwebSDK("${chainName}", nil)
contract, err := sdk.GetContract("${contractAddress}")
const result = await contract.Call("${abiFunction?.name}"${watch("params")
                          .map(
                            (f) => `, ${f.value ? `"${f.value}"` : `${f.key}`}`,
                          )
                          .join("")});`,
                      }}
                    />
                  </Flex>
                </Flex>
              </PopoverBody>
            </Card>
          </Popover>
          {isView ? (
            <Button
              isDisabled={!abiFunction}
              rightIcon={<Icon as={FiPlay} />}
              colorScheme="primary"
              isLoading={contractLoading || mutationLoading}
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
              isLoading={contractLoading || mutationLoading}
              type="submit"
              form={formId}
            >
              Execute
            </TransactionButton>
          )}
        </ButtonGroup>
      </Portal>
      <Flex
        direction="column"
        gap={2}
        as="form"
        id={formId}
        onSubmit={handleSubmit((d) => {
          if (d.params) {
            mutate(d.params.map((p) => p.value));
          }
        })}
      >
        {fields.length > 0 && (
          <>
            <Divider borderColor="borderColor" />
            <Card>
              {fields.map((item, index) => (
                <FormControl key={item.id} gap={0.5}>
                  <FormLabel>{item.key}</FormLabel>
                  <Input
                    defaultValue={getValues(`params.${index}.value`)}
                    {...register(`params.${index}.value`)}
                  />
                  <FormHelperText>{item.type}</FormHelperText>
                </FormControl>
              ))}
            </Card>
          </>
        )}

        {error ? (
          <>
            <Divider borderColor="borderColor" />
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
              {(error as Error).toString()}
            </Text>
          </>
        ) : data !== undefined ? (
          <>
            <Divider borderColor="borderColor" />
            <Heading size="label.sm">Output</Heading>
            <CodeBlock language="json" code={formatResponseData(data)} />
          </>
        ) : null}
      </Flex>
    </>
  );
};
