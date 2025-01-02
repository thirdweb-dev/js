"use client";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeClient } from "@/components/ui/code/code.client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import type { Abi, AbiFunction } from "abitype";
import { useV5DashboardChain } from "lib/v5-adapter";
import { ArrowDown, WalletIcon } from "lucide-react";
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
    success: false,
    message: "",
    codeExample: "",
    shareUrl: "",
  });
  const form = useForm<SimulateTransactionForm>();
  const chainId = form.watch("chainId");
  const chain = useV5DashboardChain(
    Number.isInteger(Number(chainId)) ? chainId : undefined,
  );
  const client = useThirdwebClient();

  async function handleSimulation(data: SimulateTransactionForm) {
    try {
      setIsPending(true);
      const { from, to, value, functionArgs, functionName } = data;
      if (!chain) {
        throw new Error("Invalid chainId");
      }
      const contract = getContract({
        client,
        chain,
        address: to,
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
          to,
          value,
          functionArgs,
          functionName,
        },
        params,
      );
      const shareUrl = getShareUrl({
        chainId: chain.id,
        from,
        to,
        value,
        functionArgs,
        functionName,
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
        success: true,
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
        codeExample,
        shareUrl,
      });
    } catch (err) {
      setState({
        success: false,
        message: `${err}`,
        codeExample: "",
        shareUrl: "",
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
        onSubmit={form.handleSubmit(handleSimulation)}
        className="flex-col space-y-4"
      >
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="chainId" className="min-w-60">
              Chain ID
            </Label>
            <Input
              type="number"
              required
              placeholder="The chain ID of the sender wallet"
              defaultValue={initialFormValues.chainId}
              {...form.register("chainId", { required: true })}
              // Hide spinner.
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="from" className="min-w-60">
              From Address
            </Label>
            <Input
              required
              placeholder="The sender wallet address"
              defaultValue={initialFormValues.from}
              {...form.register("from", { required: true })}
            />
            {activeAccount && (
              <ToolTipLabel label="Use current wallet address">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => form.setValue("from", activeAccount.address)}
                >
                  <WalletIcon className="size-4" />
                </Button>
              </ToolTipLabel>
            )}
          </div>
        </Card>

        <div className="flex justify-center">
          <ArrowDown />
        </div>

        <Card className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="to" className="min-w-60">
              Contract Address
            </Label>
            <Input
              placeholder="The contract address to call"
              defaultValue={initialFormValues.to}
              {...form.register("to", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="functionName" className="min-w-60">
              Function Name
            </Label>
            <Input
              placeholder="The contract function name (i.e. mintTo)"
              defaultValue={initialFormValues.functionName}
              {...form.register("functionName", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="functionArgs" className="min-w-60">
              Function Arguments
            </Label>
            <Textarea
              placeholder="Comma-separated arguments to call the function"
              rows={3}
              className="bg-transparent"
              {...form.register("functionArgs")}
              defaultValue={
                initialFormValues.functionArgs
                  ? decodeURIComponent(initialFormValues.functionArgs)
                  : undefined
              }
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="value" className="min-w-60">
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
            <ArrowDown />
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
            textToShow="Copy Simulation Link"
            tooltip="Copy Simulation Link"
            textToCopy={state.shareUrl}
            copyIconPosition="right"
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
            href="https://portal.thirdweb.com/references/typescript/v5/simulateTransaction"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Connect SDK example
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
