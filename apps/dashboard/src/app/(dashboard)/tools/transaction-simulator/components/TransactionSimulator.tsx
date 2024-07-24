"use client";

import { CodeBlock } from "@/components/ui/CodeBlock";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { ArrowDown } from "lucide-react";
import { useState } from "react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { useActiveAccount } from "thirdweb/react";
import { ShareButton } from "../../components/share";
import { useForm } from "react-hook-form";
import {
  defineChain,
  getContract,
  prepareContractCall,
  resolveMethod,
  simulateTransaction,
  toSerializableTransaction,
  toWei,
} from "thirdweb";
import { thirdwebClient } from "lib/thirdweb-client";

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

// Generate code example with input values.
const getCodeExample = (parsedData: SimulateTransactionForm) =>
  `import { 
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
  params: [${parsedData.functionArgs.split(/[\n,]+/).map((v) => `"${v.trim()}"`)}],
  value: ${parsedData.value ? `${parsedData.value}n` : ""},
});

await simulateTransaction({
  from: "${parsedData.from}",
  transaction,
});`;

// Generate share link from input values.
const getShareUrl = (parsedData: SimulateTransactionForm) => {
  const url = new URL("https://thirdweb.com/tools/transaction-simulator");
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

export const TransactionSimulator = (props: {
  searchParams: Partial<SimulateTransactionForm>;
}) => {
  const activeAccount = useActiveAccount();
  const initialFormValues = props.searchParams;
  const [state, setState] = useState<State>({
    success: false,
    message: "",
    codeExample: "",
    shareUrl: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    setValue,
  } = useForm<SimulateTransactionForm>();

  async function handleSimulation(data: SimulateTransactionForm) {
    const { from, to, value, functionArgs, functionName, chainId } = data;
    if (Number.isNaN(Number(chainId)) || !Number.isInteger(Number(chainId))) {
      throw new Error("Invalid chainId");
    }
    const chain = defineChain(Number(chainId));
    const contract = getContract({
      client: thirdwebClient,
      chain,
      address: to,
    });
    const codeExample = getCodeExample({
      chainId: chain.id,
      from,
      to,
      value,
      functionArgs,
      functionName,
    });
    const shareUrl = getShareUrl({
      chainId: chain.id,
      from,
      to,
      value,
      functionArgs,
      functionName,
    });
    try {
      const transaction = prepareContractCall({
        contract,
        method: resolveMethod(functionName),
        params: functionArgs
          ? functionArgs.split(/[\n,]+/).map((arg) => arg.trim())
          : [],
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
      console.log({ simulateResult, populatedTransaction });
    } catch (err) {
      console.log(err);
      setState({
        success: false,
        message: `${err}`,
        codeExample,
        shareUrl,
      });
    }
  }
  return (
    <div className="max-w-[800px] space-y-4">
      <p>
        Simulate a transaction on any EVM chain. Account Abstraction support is
        coming soon.
      </p>

      <form
        onSubmit={handleSubmit(handleSimulation)}
        className="space-y-4 flex-col"
      >
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="chainId" className="min-w-60">
              Chain ID
            </Label>
            <Input
              type="number"
              required
              placeholder="The chain ID of the sender wallet"
              defaultValue={initialFormValues.chainId}
              {...register("chainId", { required: true })}
              // Hide spinner.
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="from" className="min-w-60">
              From Address
            </Label>
            <Input
              required
              placeholder="The sender wallet address"
              defaultValue={initialFormValues.from}
              {...register("from", { required: true })}
            />
            {activeAccount && (
              <ToolTipLabel label="Use current wallet address">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setValue("from", activeAccount.address)}
                >
                  <MdOutlineAccountBalanceWallet />
                </Button>
              </ToolTipLabel>
            )}
          </div>
        </Card>

        <div className="flex justify-center">
          <ArrowDown />
        </div>

        <Card className="flex flex-col gap-4 p-4">
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="to" className="min-w-60">
              Contract Address
            </Label>
            <Input
              placeholder="The contract address to call"
              defaultValue={initialFormValues.to}
              {...register("to", { required: true })}
            />
          </div>
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="functionName" className="min-w-60">
              Function Name
            </Label>
            <Input
              placeholder="The contract function name (i.e. mintTo)"
              defaultValue={initialFormValues.functionName}
              {...register("functionName", { required: true })}
            />
          </div>
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="functionArgs" className="min-w-60">
              Function Arguments
            </Label>
            <Textarea
              placeholder="Comma-separated arguments to call the function"
              rows={3}
              className="bg-transparent"
              {...register("functionArgs")}
              defaultValue={
                initialFormValues.functionArgs
                  ? decodeURIComponent(initialFormValues.functionArgs)
                  : undefined
              }
            />
          </div>
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="value" className="min-w-60">
              Value
            </Label>
            <Input
              {...register("value")}
              placeholder={`The amount of native currency to send (e.g "0.01")`}
            />
          </div>

          <Button type="submit">
            {isLoading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
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
            <p className="text-sm font-mono whitespace-pre-wrap overflow-auto">
              {state.success
                ? "--- ✅ Simulation succeeded ---\n"
                : "--- ❌ Simulation failed ---\n"}
              {state.message}
            </p>
          </Card>
        </>
      )}

      <div className="flex justify-between">
        {state.shareUrl ? (
          <CopyTextButton
            textToShow="Copy Simulation Link"
            tooltip="Copy Simulation Link"
            textToCopy={state.shareUrl}
            copyIconPosition="right"
          />
        ) : (
          <div />
        )}
        <ShareButton
          cta="Share on X"
          href="https://twitter.com/intent/tweet?text=Easy-to-use%20transaction%20simulator%20by%20thirdweb%20%F0%9F%98%8D&url=https%3A%2F%2Fthirdweb.com%2Ftools%2Ftransaction-simulator"
        />
      </div>

      {state.codeExample && (
        <div className="max-w-[800px] flex flex-col gap-2 pt-16 ">
          <a
            href="https://portal.thirdweb.com/references/typescript/v5/simulateTransaction"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Connect SDK example
          </a>
          <CodeBlock code={state.codeExample} language="typescript" />
        </div>
      )}
    </div>
  );
};
