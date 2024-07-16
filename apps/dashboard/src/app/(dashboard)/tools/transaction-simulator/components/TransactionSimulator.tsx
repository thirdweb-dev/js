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
import { useRef } from "react";
import { useFormState } from "react-dom";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { useActiveAccount } from "thirdweb/react";
import { ShareButton } from "../../components/share";
import { simulateTransactionAction } from "./simulate-transaction.action";

export type SimulateTransactionForm = {
  chainId: number;
  from: string;
  to: string;
  functionName: string;
  functionArgs: string;
  value: string;
};

export const TransactionSimulator = (props: {
  searchParams: Partial<SimulateTransactionForm>;
}) => {
  const initialFormValues = props.searchParams;
  const fromInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useFormState(
    simulateTransactionAction,
    {
      success: false,
      message: "",
      codeExample: "",
      shareUrl: "",
    },
  );
  const activeAccount = useActiveAccount();

  return (
    <div className="max-w-[800px] space-y-4">
      <p>
        Simulate a transaction on any EVM chain. Account Abstraction support is
        coming soon.
      </p>

      <form action={formAction} className="space-y-4 flex-col">
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="chainId" className="min-w-60">
              Chain ID
            </Label>
            <Input
              type="number"
              name="chainId"
              required
              placeholder="The chain ID of the sender wallet"
              defaultValue={initialFormValues.chainId}
              // Hide spinner.
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="from" className="min-w-60">
              From Address
            </Label>
            <Input
              ref={fromInputRef}
              name="from"
              required
              placeholder="The sender wallet address"
              defaultValue={initialFormValues.from}
            />
            {activeAccount && (
              <ToolTipLabel label="Use current wallet address">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (fromInputRef.current) {
                      // eslint-disable-next-line react-compiler/react-compiler
                      fromInputRef.current.value = activeAccount.address;
                    }
                  }}
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
              name="to"
              required
              placeholder="The contract address to call"
              defaultValue={initialFormValues.to}
            />
          </div>
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="functionName" className="min-w-60">
              Function Name
            </Label>
            <Input
              name="functionName"
              required
              placeholder="The contract function name (i.e. mintTo)"
              defaultValue={initialFormValues.functionName}
            />
          </div>
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="functionArgs" className="min-w-60">
              Function Arguments
            </Label>
            <Textarea
              name="functionArgs"
              placeholder="Comma-separated arguments to call the function"
              rows={3}
              className="bg-transparent"
              defaultValue={
                initialFormValues.functionArgs
                  ? decodeURIComponent(initialFormValues.functionArgs)
                  : undefined
              }
            />
          </div>
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="value" className="min-w-60">
              Value in Wei
            </Label>
            <Input
              name="value"
              required
              placeholder="The amount of native currency to send in wei"
              defaultValue={initialFormValues.value ?? 0}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : "Simulate Transaction"}
          </Button>
        </Card>
      </form>

      {state.message && (
        <>
          <div className="flex justify-center">
            <ArrowDown />
          </div>
          <Card className="max-w-[800px] p-4">
            <p className="text-sm font-mono whitespace-pre-wrap overflow-scroll">
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
