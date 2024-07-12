import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { thirdwebClient } from "@/constants/client";
import { ArrowDown } from "lucide-react";
import { redirect } from "next/navigation";
import {
  type Address,
  defineChain,
  getContract,
  prepareContractCall,
  resolveMethod,
  simulateTransaction,
  toSerializableTransaction,
} from "thirdweb";

export interface SimulateTransactionResult {
  error?: string;
  gas?: string;
}

const toQueryParams = (res: SimulateTransactionResult) =>
  Object.entries(res)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

export const TransactionSimulator = ({
  searchParams,
}: {
  searchParams: SimulateTransactionResult;
}) => {
  const onSubmit = async (formData: FormData) => {
    "use server";

    const chainId = Number(formData.get("chain-input") as string);
    const from = formData.get("from-input") as Address;
    const to = formData.get("to-input") as Address;
    const functionName = formData.get("fn-name-input") as string;
    const _functionArgs = formData.get("fn-args-input") as string;
    // const functionArgs = _functionArgs.split(/[\n,]+/);
    const functionArgs: string[] = [];
    const value = formData.get("value-input") as string;

    console.log("...", chainId);
    console.log("...", from);
    console.log("...", to);
    console.log("...", functionName);
    console.log("...", functionArgs);
    console.log("...", value);

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
      params: functionArgs,
      value: value ? BigInt(value) : 0n,
    });
    try {
      const simulateResult = await simulateTransaction({
        from,
        transaction,
      });

      const populatedTransaction = await toSerializableTransaction({
        from,
        transaction,
      });
      return redirect(
        `/tools/simulator?${toQueryParams({
          gas: "5",
        })}`,
      );
    } catch (e: unknown) {
      return redirect(
        `/tools/simulator?${toQueryParams({
          error: `${e}`,
        })}`,
      );
    }
  };

  return (
    <div className="space-y-24">
      <form className="space-y-4 flex-col items-center max-w-[600px]">
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="chain-input" className="min-w-64">
              Chain
            </Label>
            <Input name="chain-input" required placeholder="" />
          </div>

          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="from-input" className="min-w-64">
              From Address
            </Label>
            <Input name="from-input" required placeholder="0x..." />
          </div>
        </Card>

        <ArrowDown />

        <Card className="flex flex-col gap-4 p-4">
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="to-input" className="min-w-64">
              Contract Address
            </Label>
            <Input name="to-input" required placeholder="0x..." />
          </div>
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="fn-name-input" className="min-w-64">
              Function Name
            </Label>
            <Input name="fn-name-input" required placeholder="" />
          </div>
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            <Label htmlFor="fn-args-input" className="min-w-64">
              Function Args
            </Label>
            <Textarea
              name="fn-args-input"
              placeholder="Comma-separated function args"
              rows={3}
              className="bg-transparent"
            />
          </div>

          <Button formAction={onSubmit} type="submit">
            Simulate
          </Button>
        </Card>
      </form>

      <p>Error: {searchParams?.error}</p>
    </div>
  );
};
