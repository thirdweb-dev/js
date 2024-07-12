import { CopyTextButton } from "@/components/ui/CopyTextButton";
import {
  Container,
  Divider,
  Flex,
  FormControl,
  Input,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { type AbiFunction, formatAbiItem } from "abitype";
import { AppRouterProviders } from "app/providers";
import { NetworkDropdown } from "components/contract-components/contract-publish-form/NetworkDropdown";
import { LandingLayout } from "components/landing-pages/layout";
import { useContractAbiItems } from "hooks/useContractAbiItems";
import { thirdwebClient } from "lib/thirdweb-client";
import { ArrowDownIcon } from "lucide-react";
import type { GetServerSideProps } from "next";
import { PageId } from "page-id";
import { useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import {
  type Address,
  defineChain,
  getContract,
  prepareContractCall,
  resolveMethod,
  simulateTransaction,
  toSerializableTransaction,
} from "thirdweb";
import {
  Button,
  Card,
  CodeBlock,
  FormHelperText,
  FormLabel,
  Heading,
  Link,
  Text,
} from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

interface SimulateTransactionForm {
  chainId: number;
  from: Address;
  to: Address;
  functionName: string;
  functionArgs: string;
  value?: string;
}

const SimulateTransactionPage: ThirdwebNextPage = ({
  initialFormValues,
}: {
  initialFormValues: SimulateTransactionForm | null;
}) => {
  return (
    <LandingLayout
      seo={{
        title: "thirdweb Simulate Transaction",
        description:
          "Simulate any EVM transaction. Get gas estimates and onchain error messages to debug your contract calls.",
      }}
    >
      <AppRouterProviders>
        <Container maxW="container.page" as={Flex} flexDir="column" gap={6}>
          <Stack gap={12} my={12}>
            <Heading>Simulate Transaction</Heading>
            <SimulateTransactionPanel initialFormValues={initialFormValues} />
          </Stack>
        </Container>
      </AppRouterProviders>
    </LandingLayout>
  );
};

SimulateTransactionPage.pageId = PageId.ToS;

export default SimulateTransactionPage;

const SimulateTransactionPanel = ({
  initialFormValues,
}: {
  initialFormValues: SimulateTransactionForm | null;
}) => {
  const [simulateResults, setSimulateResults] = useState<string>("");
  const form = useForm<SimulateTransactionForm>({
    defaultValues: initialFormValues ?? {
      chainId: 84532,
      from: "0x",
      to: "0x",
      functionName: "",
      functionArgs: "",
      value: "0",
    },
  });

  const onSubmit = async (data: SimulateTransactionForm) => {
    const { chainId, from, to, functionName, functionArgs, value } = data;

    try {
      const chain = defineChain({
        id: chainId,
        // @DEBUG: DO NOT MERGE THIS LINE
        rpc: `https://${chainId}.rpc.thirdweb-dev.com`,
      });

      const contract = getContract({
        client: thirdwebClient,
        chain,
        address: to,
      });
      const transaction = await prepareContractCall({
        contract,
        method: resolveMethod(functionName),
        params: functionArgs.split(/[\n,]+/),
        value: value ? BigInt(value) : 0n,
      });
      const simulateResult = await simulateTransaction({
        from,
        transaction,
      });

      const populatedTransaction = await toSerializableTransaction({
        from,
        transaction,
      });

      setSimulateResults(`✅ Passed simulation:
- result: ${simulateResult.length > 0 ? simulateResult.join(",") : "(no result returned by method)"}
- data: ${populatedTransaction.data}
- gas: ${populatedTransaction.gas}
- maxFeePerGas: ${populatedTransaction.maxFeePerGas}
- maxPriorityFeePerGas: ${populatedTransaction.maxPriorityFeePerGas}
- value: ${populatedTransaction.value}
`);
    } catch (e) {
      setSimulateResults(`❌ Failed simulation:\n${e}`);
    }
  };

  const formValues = form.watch();
  const isWellFormedContractAddress = /^0x[0-9a-fA-F]{40}$/.test(formValues.to);

  return (
    <Stack gap={12}>
      <Flex flexDir={{ base: "column", lg: "row" }} gap={8}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack width={{ base: "full", lg: 600 }} gap={4} align="center">
            <Card as={Stack} gap={4} w="full">
              <FormControl isRequired>
                <FormLabel>Chain</FormLabel>
                <NetworkDropdown
                  value={formValues.chainId}
                  onSingleChange={(val) => form.setValue("chainId", val)}
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>From Address</FormLabel>
                <Input
                  {...form.register("from", { required: true })}
                  placeholder="0x..."
                  size="lg"
                  fontFamily="mono"
                />
              </FormControl>
            </Card>

            <ArrowDownIcon />

            <Card as={Stack} gap={4} w="full">
              <FormControl isRequired>
                <FormLabel>Contract Address</FormLabel>
                <Input
                  {...form.register("to", { required: true })}
                  placeholder="0x..."
                  size="lg"
                  fontFamily="mono"
                />
              </FormControl>

              {isWellFormedContractAddress ? (
                <>
                  <FunctionInputs form={form} />

                  <Button
                    type="submit"
                    colorScheme="primary"
                    isDisabled={!form.formState.isValid}
                  >
                    Simulate
                  </Button>
                </>
              ) : (
                <Button colorScheme="primary" isDisabled>
                  Continue
                </Button>
              )}
            </Card>
          </Stack>
        </form>

        <Stack flex={1} gap={4} maxWidth={600}>
          {simulateResults ? (
            <>
              <CodeBlock
                language="typescript"
                code={simulateResults}
                canCopy={false}
                overflow="scroll"
                height="fit-content"
              />

              <ShareLinkButton formValues={formValues} />
            </>
          ) : (
            <Text fontStyle="italic">
              Enter transaction details to simulate.
            </Text>
          )}
        </Stack>
      </Flex>

      {/* Hide code example until simulated */}
      {simulateResults && (
        <>
          <Divider />

          <Stack>
            <Text fontSize="small">
              <Link
                href="https://portal.thirdweb.com/references/typescript/v5/simulateTransaction"
                isExternal
              >
                Connect SDK example
              </Link>
            </Text>
            <CodeBlock
              language="typescript"
              code={getCodeExample(formValues)}
              overflow="scroll"
              wrap={false}
              width={{ base: "full", lg: 600 }}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
};

const getCodeExample = (formValues: SimulateTransactionForm) =>
  `const contract = getContract({
    client,
    chain,
    address: "${formValues.to}",
});

const transaction = await prepareContractCall({
    contract,
    method: resolveMethod("${formValues.functionName}"),
    params: [${formValues.functionArgs.split(/[\n,]+/).map((v) => `"${v}"`)}],
    value: ${formValues.value}n,
});

await simulateTransaction({ from, transaction });
`;

const FunctionInputs = ({
  form,
}: {
  form: UseFormReturn<SimulateTransactionForm>;
}) => {
  const { data } = useContractAbiItems(form.watch("chainId"), form.watch("to"));

  if (data.writeFunctions.length === 0) {
    return null;
  }

  const getFullSignature = (fn: AbiFunction) => {
    const fullSignature = formatAbiItem(fn);
    const match = fullSignature.match(/^function\s+([^(]+\([^)]*\))/);
    if (!match) {
      throw new Error(`Invalid function signature: ${JSON.stringify(fn)}`);
    }
    return match[1];
  };

  const getFunctionNames = (
    fns: AbiFunction[],
  ): Record<string, AbiFunction> => {
    // Get duplicate function names.
    const functionNames = new Set<string>();
    const duplicateFunctionNames = new Set<string>();
    for (const { name } of fns) {
      if (functionNames.has(name)) {
        duplicateFunctionNames.add(name);
      } else {
        functionNames.add(name);
      }
    }

    // Get function signatures. Use the full signature for duplicate names.
    const results: Record<string, AbiFunction> = {};
    for (const fn of fns) {
      if (duplicateFunctionNames.has(fn.name)) {
        results[getFullSignature(fn)] = fn;
      } else {
        results[fn.name] = fn;
      }
    }
    return results;
  };

  const functionNameToAbiFunction = getFunctionNames(data.writeFunctions);
  const selectedFunctionName = form.watch("functionName");
  const selectedAbiFunction = functionNameToAbiFunction[selectedFunctionName];

  return (
    <>
      <FormControl isRequired>
        <FormLabel>Function Name</FormLabel>
        <Select
          {...form.register("functionName", { required: true })}
          size="lg"
        >
          {Object.keys(functionNameToAbiFunction).map((signature) => (
            <option key={signature} value={signature}>
              {signature}
            </option>
          ))}
        </Select>
        {selectedAbiFunction && (
          <FormHelperText>
            {getFullSignature(selectedAbiFunction)}
          </FormHelperText>
        )}
      </FormControl>

      {selectedAbiFunction && (
        <FormControl>
          <FormLabel>Function Args</FormLabel>
          <Textarea
            {...form.register("functionArgs", { required: false })}
            placeholder="Comma-separated arguments"
            rows={4}
            size="lg"
          />
        </FormControl>
      )}

      {selectedAbiFunction?.stateMutability === "payable" && (
        <FormControl>
          <FormLabel>Value in Wei</FormLabel>
          <Input
            {...form.register("value", { required: false })}
            placeholder="0"
            size="lg"
          />
        </FormControl>
      )}
    </>
  );
};

const ShareLinkButton = ({
  formValues,
}: {
  formValues: SimulateTransactionForm;
}) => {
  const formValuesBase64 = btoa(JSON.stringify(formValues));
  const shareLinkUrl = `https://thirdweb.com/tools/simulator?f=${formValuesBase64}`;

  return (
    <Flex justify="flex-end">
      <CopyTextButton
        textToShow="Copy simulation link"
        textToCopy={shareLinkUrl}
        tooltip="Copy simulation link"
        variant="ghost"
        copyIconPosition="right"
      />
    </Flex>
  );
};

/**
 * Server-side props are used to read/parse the query param and pre-populate the form.
 */
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { f } = query;

  let initialFormValues: SimulateTransactionForm | null = null;
  const formValuesBase64 = f ? (Array.isArray(f) ? f[0] : f) : undefined;
  if (formValuesBase64) {
    try {
      initialFormValues = JSON.parse(atob(formValuesBase64));
    } catch (error) {}
  }

  return {
    props: {
      initialFormValues,
    },
  };
};
