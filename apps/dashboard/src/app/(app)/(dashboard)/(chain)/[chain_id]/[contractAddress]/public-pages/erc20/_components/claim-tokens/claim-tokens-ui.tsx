"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  CheckIcon,
  CircleIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import {
  type ThirdwebContract,
  padHex,
  sendAndConfirmTransaction,
  toTokens,
  waitForReceipt,
} from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import {
  claimTo,
  type getActiveClaimCondition,
  getApprovalForTransaction,
} from "thirdweb/extensions/erc20";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getClaimParams } from "thirdweb/utils";
import { tryCatch } from "utils/try-catch";
import { getSDKTheme } from "../../../../../../../../components/sdk-component-theme";
import { PublicPageConnectButton } from "../../../_components/PublicPageConnectButton";
import { getCurrencyMeta } from "../../_utils/getCurrencyMeta";

type ActiveClaimCondition = Awaited<ReturnType<typeof getActiveClaimCondition>>;

// TODO UI improvements - show how many tokens connected wallet can claim at max

export function ClaimTokenCardUI(props: {
  contract: ThirdwebContract;
  name: string;
  symbol: string | undefined;
  claimCondition: ActiveClaimCondition;
  chainMetadata: ChainMetadata;
  decimals: number;
  claimConditionCurrency: {
    decimals: number;
    symbol: string;
  };
}) {
  const [quantity, setQuantity] = useState(1);
  const account = useActiveAccount();
  const { theme } = useTheme();
  const sendClaimTx = useSendTransaction({
    payModal: {
      theme: getSDKTheme(theme === "light" ? "light" : "dark"),
    },
  });
  const [stepsUI, setStepsUI] = useState<
    | undefined
    | {
        approve: undefined | "idle" | "pending" | "success" | "error";
        claim: "idle" | "pending" | "success" | "error";
      }
  >(undefined);

  const approveAndClaim = useMutation({
    mutationFn: async () => {
      if (!account) {
        toast.error("Wallet is not connected");
        return;
      }

      setStepsUI(undefined);

      const transaction = claimTo({
        contract: props.contract,
        to: account.address,
        quantity: String(quantity),
        from: account.address,
      });

      const approveTx = await getApprovalForTransaction({
        transaction,
        account,
      });

      if (approveTx) {
        setStepsUI({
          approve: "pending",
          claim: "idle",
        });

        const approveTxResult = await tryCatch(
          sendAndConfirmTransaction({
            transaction: approveTx,
            account,
          }),
        );

        if (approveTxResult.error) {
          setStepsUI({
            approve: "error",
            claim: "idle",
          });
          console.error(approveTxResult.error);
          toast.error("Failed to approve spending", {
            description: approveTxResult.error.message,
          });
          return;
        }

        setStepsUI({
          approve: "success",
          claim: "pending",
        });
      }

      async function sendAndConfirm() {
        const result = await sendClaimTx.mutateAsync(transaction);
        await waitForReceipt(result);
      }

      setStepsUI({
        approve: approveTx ? "success" : undefined,
        claim: "pending",
      });

      const claimTxResult = await tryCatch(sendAndConfirm());
      if (claimTxResult.error) {
        setStepsUI({
          approve: approveTx ? "success" : undefined,
          claim: "error",
        });
        console.error(claimTxResult.error);
        toast.error("Failed to claim tokens", {
          description: claimTxResult.error.message,
        });
        return;
      }

      setStepsUI({
        approve: approveTx ? "success" : undefined,
        claim: "success",
      });

      toast.success("Tokens claimed successfully");
    },
  });

  const claimParamsQuery = useQuery({
    queryKey: [
      "claim-params",
      props.contract.address,
      quantity,
      account?.address,
    ],
    queryFn: async () => {
      const defaultPricing = {
        pricePerTokenWei: props.claimCondition.pricePerToken,
        currencyAddress: props.claimCondition.currency,
        decimals: props.claimConditionCurrency.decimals,
        symbol: props.claimConditionCurrency.symbol,
      };

      if (!account) {
        return defaultPricing;
      }

      const merkleRoot = props.claimCondition.merkleRoot;
      if (!merkleRoot || merkleRoot === padHex("0x", { size: 32 })) {
        return defaultPricing;
      }

      const claimParams = await getClaimParams({
        contract: props.contract,
        to: account.address,
        quantity: BigInt(quantity),
        type: "erc20",
        tokenDecimals: props.decimals,
        from: account.address,
      });

      const meta = await getCurrencyMeta({
        currencyAddress: claimParams.currency,
        chainMetadata: props.chainMetadata,
        chain: props.contract.chain,
        client: props.contract.client,
      });

      return {
        pricePerTokenWei: claimParams.pricePerToken,
        currencyAddress: claimParams.currency,
        decimals: meta.decimals,
        symbol: meta.symbol,
      };
    },
  });

  const claimParamsData = claimParamsQuery.data;

  const totalPriceInTokens = claimParamsData
    ? Number(
        toTokens(claimParamsData.pricePerTokenWei, claimParamsData.decimals),
      ) * quantity
    : undefined;

  return (
    <div className="rounded-xl border bg-card ">
      <div className="border-b px-4 py-5 lg:px-5">
        <h2 className="font-bold text-lg">Buy {props.symbol}</h2>
        <p className="text-muted-foreground text-sm">
          Buy tokens from the primary sale
        </p>
      </div>

      <div className="p-4 lg:p-5">
        <div>
          <div className="space-y-2">
            <Label htmlFor="token-amount">Tokens</Label>
            <PriceInput
              quantity={quantity}
              setQuantity={setQuantity}
              id="token-amount"
            />
            {/* <p className="text-xs text-muted-foreground">Maximum purchasable: {tokenData.maxPurchasable} tokens</p> */}
          </div>

          <div className="h-4" />

          <div className="space-y-3 rounded-lg bg-muted/50 p-3">
            {/* Price per token */}
            <div className="flex justify-between font-medium text-sm">
              <span>Price per token</span>

              <SkeletonContainer
                skeletonData={`0.00 ${props.claimConditionCurrency.symbol}`}
                loadedData={
                  claimParamsData
                    ? `${toTokens(
                        claimParamsData.pricePerTokenWei,
                        claimParamsData.decimals,
                      )} ${claimParamsData.symbol}`
                    : undefined
                }
                render={(v) => {
                  return <span className="">{v}</span>;
                }}
              />
            </div>

            {/* Quantity */}
            <div className="flex justify-between font-medium text-sm">
              <span>Quantity</span>
              <span>
                {quantity} Token{quantity > 1 ? "s" : ""}
              </span>
            </div>

            {/* Total Price */}
            <div className="border-active-border border-t border-dashed pt-4">
              <div className="flex justify-between font-semibold text-sm">
                <span>Total Price</span>
                <SkeletonContainer
                  skeletonData={"0.00 ETH"}
                  loadedData={
                    totalPriceInTokens && claimParamsData
                      ? `${totalPriceInTokens} ${claimParamsData.symbol}`
                      : undefined
                  }
                  render={(v) => {
                    return <span>{v}</span>;
                  }}
                />
              </div>
            </div>
          </div>

          <div className="h-6" />

          {account ? (
            <TransactionButton
              transactionCount={undefined}
              checkBalance={false}
              isLoggedIn={true}
              isPending={approveAndClaim.isPending}
              onClick={async () => {
                approveAndClaim.mutate();
              }}
              variant="default"
              className="!w-full"
              txChainID={props.contract.chain.id}
              disabled={approveAndClaim.isPending || !claimParamsData}
            >
              Buy Token{quantity > 1 ? "s" : ""}
            </TransactionButton>
          ) : (
            <PublicPageConnectButton connectButtonClassName="!w-full" />
          )}

          {/* only show steps if approval is required */}
          {stepsUI?.approve && (
            <div className="mt-6 border-t border-dashed pt-3">
              <h2 className="mb-2 font-semibold">Status</h2>
              <div className="space-y-2">
                {stepsUI.approve && (
                  <StepUI title="Approve Spending" status={stepsUI.approve} />
                )}

                {stepsUI.claim && (
                  <StepUI title={"Buy Tokens"} status={stepsUI.claim} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Status = "idle" | "pending" | "success" | "error";

const statusToIcon: Record<Status, React.FC<{ className: string }>> = {
  pending: Spinner,
  success: CheckIcon,
  error: XIcon,
  idle: CircleIcon,
};

function StepUI(props: {
  title: string;
  status: Status;
}) {
  const Icon = statusToIcon[props.status];
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        props.status === "pending" && "text-blue-500",
        props.status === "success" && "text-green-500",
        props.status === "error" && "text-red-500",
      )}
    >
      <Icon className="size-4" />
      <p className="font-medium text-sm">{props.title}</p>
    </div>
  );
}

function PriceInput(props: {
  quantity: number;
  setQuantity: (quantity: number) => void;
  id: string;
}) {
  return (
    <div className="flex items-center">
      <Input
        id={props.id}
        type="number"
        value={props.quantity}
        onChange={(e) =>
          props.setQuantity(Math.max(1, Number(e.target.value) || 1))
        }
        min="1"
        className="!text-xl h-12 rounded-r-none border-r-0 font-semibold "
      />

      <Button
        variant="outline"
        className="h-12 w-16 rounded-none border-r-0 bg-background p-0 disabled:opacity-100"
        onClick={() => props.setQuantity(props.quantity - 1)}
        disabled={props.quantity <= 1}
      >
        <MinusIcon className="size-4" />
      </Button>

      <Button
        className="h-12 w-16 rounded-l-none bg-background p-0 disabled:opacity-100"
        variant="outline"
        onClick={() => props.setQuantity(props.quantity + 1)}
      >
        <PlusIcon className="size-4" />
      </Button>
    </div>
  );
}
