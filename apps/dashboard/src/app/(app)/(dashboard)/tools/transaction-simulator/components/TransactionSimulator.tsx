"use client";
import type { Abi, AbiFunction } from "abitype";
import { ArrowDownIcon, WalletIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getContract,
  prepareContractCall,
  resolveMethod,
  simulateTransaction,
  toSerializableTransaction,
  toWei,
} from "thirdweb";
import { resolveContractAbi } from "thirdweb/contract";
import { useActiveAccount } from "thirdweb/react";
import { parseAbiParams } from "thirdweb/utils";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card } from "@/components/ui/card";
import { CodeClient } from "@/components/ui/code/code.client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { ShareButton } from "../../components/share";

export type SimulateTransactionForm = {
  chainId: number;
  from: string;
  to: string;
  functionName: string;
  functionArgs: string;
  value: string;
};

type State = {
  success: boolean;
  message: string;
  codeExample: string;
  shareUrl: string;
};

export const TransactionSimulator = (props: {
  searchParams: Partial<SimulateTransactionForm>;
}) => {
  const activeAccount = useActiveAccount();
  const initialFormValues = props.searchParams;
  // TODO - replace this with a mutation.isPending
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<State>({
    codeExample: "",
    message: "",
    shareUrl: "",
    success: false,
  });
  const form = useForm<SimulateTransactionForm>();
  const chainId = form.watch("chainId");
  const chain = useV5DashboardChain(
    Number.isInteger(Number(chainId)) ? chainId : undefined,
  );
  const client = getClientThirdwebClient();
  async function handleSimulation(data: SimulateTransactionForm) {
    try {
      setIsPending(true);
      const { from, to, value, functionArgs, functionName } = data;
      if (!chain) {
        throw new Error("Invalid chainId");
      }
      const contract = getContract({
        address: to,
        chain,
        client,
      });
      const abi = (await resolveContractAbi(contract)) as Abi;
      const abiItem = abi.find(
        (o) => o.type === "function" && o.name === functionName,
      ) as AbiFunction;
      if (!abiItem) {
        throw new Error(`Contract does not have method \`${functionName}]\``);
      }
      const inputParams = functionArgs
        ? functionArgs.split(/[\n,]+/).map((arg) => arg.trim())
        : [];
      if (abiItem.inputs.length !== inputParams.length) {
        throw new Error(
          `Param length mismatch. Expected ${abiItem.inputs.length} params. Received ${
            inputParams.length
          }`,
        );
      }
      // Parse to proper types
      const types = abiItem.inputs.map((o) => o.type);
      const params = parseAbiParams(types, inputParams);
      const codeExample = getCodeExample(
        {
          chainId: chain.id,
          from,
          functionArgs,
          functionName,
          to,
          value,
        },
        params,
      );
      const shareUrl = getShareUrl({
        chainId: chain.id,
        from,
        functionArgs,
        functionName,
        to,
        value,
      });
      const transaction = prepareContractCall({
        contract,
        method: resolveMethod(functionName),
        params,
        value: value ? toWei(value) : undefined,
      });
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
      setState({
        codeExample,
        message: `result: ${simulateResult.length > 0 ? simulateResult.join(",") : "Method did not return a result."}\n
${Object.keys(populatedTransaction)
  .map((key) => {
    let _val = populatedTransaction[key as keyof typeof populatedTransaction];
    if (key === "value" && !_val) {
      _val = 0;
    }
    return `${key}: ${_val}\n`;
  })
  .join("")}`,
        shareUrl,
        success: true,
      });
    } catch (err) {
      setState({
        codeExample: "",
        message: `${err}`,
        shareUrl: "",
        success: false,
      });
    }
    setIsPending(false);
  }
  return (
    <div className="max-w-[800px] space-y-4">
      <p>
        Simulate a transaction on any EVM chain. Account Abstraction support is
        coming soon.
      </p>

      <form
        className="flex-col space-y-4"
        onSubmit={form.handleSubmit(handleSimulation)}
      >
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label className="min-w-60" htmlFor="chainId">
              Chain ID
            </Label>
            <Input
              defaultValue={initialFormValues.chainId}
              placeholder="The chain ID of the sender wallet"
              required
              type="number"
              {...form.register("chainId", { required: true })}
              // Hide spinner.
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label className="min-w-60" htmlFor="from">
              From Address
            </Label>
            <Input
              defaultValue={initialFormValues.from}
              placeholder="The sender wallet address"
              required
              {...form.register("from", { required: true })}
            />
            {activeAccount && (
              <ToolTipLabel label="Use current wallet address">
                <Button
                  onClick={() => form.setValue("from", activeAccount.address)}
                  size="icon"
                  variant="ghost"
                >
                  <WalletIcon className="size-4" />
                </Button>
              </ToolTipLabel>
            )}
          </div>
        </Card>

        <div className="flex justify-center">
          <ArrowDownIcon className="size-4" />
        </div>

        <Card className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label className="min-w-60" htmlFor="to">
              Contract Address
            </Label>
            <Input
              defaultValue={initialFormValues.to}
              placeholder="The contract address to call"
              {...form.register("to", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label className="min-w-60" htmlFor="functionName">
              Function Name
            </Label>
            <Input
              defaultValue={initialFormValues.functionName}
              placeholder="The contract function name (i.e. mintTo)"
              {...form.register("functionName", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label className="min-w-60" htmlFor="functionArgs">
              Function Arguments
            </Label>
            <Textarea
              className="bg-transparent"
              placeholder="Comma-separated arguments to call the function"
              rows={3}
              {...form.register("functionArgs")}
              defaultValue={
                initialFormValues.functionArgs
                  ? decodeURIComponent(initialFormValues.functionArgs)
                  : undefined
              }
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label className="min-w-60" htmlFor="value">
              Value
            </Label>
            <Input
              {...form.register("value")}
              placeholder={`The amount of native currency to send (e.g "0.01")`}
            />
          </div>

          <Button type="submit">
            {isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Simulating
              </>
            ) : (
              "Simulate Transaction"
            )}
          </Button>
        </Card>
      </form>

      {state.message && (
        <>
          <div className="flex justify-center">
            <ArrowDownIcon className="size-4" />
          </div>
          <Card className="max-w-[800px] p-4">
            <p className="overflow-auto whitespace-pre-wrap font-mono text-sm">
              {state.success
                ? "--- ✅ Simulation succeeded ---\n"
                : "--- ❌ Simulation failed ---\n"}
              {state.message}
            </p>
          </Card>
        </>
      )}

      <div className="flex justify-between">
        {state.shareUrl && (
          <CopyTextButton
            copyIconPosition="right"
            textToCopy={state.shareUrl}
            textToShow="Copy Simulation Link"
            tooltip="Copy Simulation Link"
          />
        )}
        <ShareButton
          cta="Share on X"
          href="https://twitter.com/intent/tweet?text=Easy-to-use%20transaction%20simulator%20by%20thirdweb%20%F0%9F%98%8D&url=https%3A%2F%2Fthirdweb.com%2Ftools%2Ftransaction-simulator"
        />
      </div>

      {state.codeExample && (
        <div className="flex max-w-[800px] flex-col gap-2 pt-16 ">
          <a
            className="underline"
            href="https://portal.thirdweb.com/references/typescript/v5/simulateTransaction"
            rel="noopener noreferrer"
            target="_blank"
          >
            TypeScript SDK example
          </a>
          <CodeClient code={state.codeExample} lang="ts" />
        </div>
      )}
    </div>
  );
};

// Generate code example with input values.
const getCodeExample = (
  parsedData: SimulateTransactionForm,
  params: unknown[],
) => {
  const displayParams = params.map((item) => {
    if (typeof item === "bigint") {
      return `${item.toString()}n`;
    }
    if (typeof item === "string") {
      return `"${item}"`;
    }
    if (
      typeof item === "object" &&
      item !== null &&
      !Array.isArray(item) &&
      Object.prototype.toString.call(item) === "[object Object]"
    ) {
      return JSON.stringify(item);
    }
    return item;
  });
  return `import {
  getContract,
  defineChain,
  prepareContractCall,
  createThirdwebClient
} from "thirdweb";

const client = createThirdwebClient({
  // use secretKey instead of clientId in backend environment
  clientId: "your-client-id",
});

const contract = getContract({
  client,
  chain: defineChain(${parsedData.chainId}),
  address: "${parsedData.to}",
});

const transaction = prepareContractCall({
  contract,
  method: resolveMethod("${parsedData.functionName}"),
  params: [${displayParams.join(", ")}],
  ${parsedData.value ? `value: ${parsedData.value}n,` : ""}
});

const result = await simulateTransaction({
  from: "${parsedData.from}",
  transaction,
});`;
};

// Generate share link from input values.
const getShareUrl = (parsedData: SimulateTransactionForm) => {
  const url = new URL(`${window.location.origin}/tools/transaction-simulator`);
  url.searchParams.set("chainId", parsedData.chainId.toString());
  url.searchParams.set("from", parsedData.from);
  url.searchParams.set("to", parsedData.to);
  url.searchParams.set("functionName", parsedData.functionName);
  url.searchParams.set(
    "functionArgs",
    encodeURIComponent(parsedData.functionArgs),
  );
  url.searchParams.set("value", parsedData.value);
  return url.href;
};
