"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckIcon,
  CircleAlertIcon,
  CircleIcon,
  ExternalLinkIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { toast } from "sonner";
import { padHex, type ThirdwebContract, toTokens } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import {
  claimTo,
  type getActiveClaimCondition,
  getApprovalForTransaction,
} from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { getClaimParams, maxUint256 } from "thirdweb/utils";
import {
  reportAssetBuyFailed,
  reportAssetBuySuccessful,
} from "@/analytics/report";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import { DecimalInput } from "@/components/ui/decimal-input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/Spinner";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { cn } from "@/lib/utils";
import { parseError } from "@/utils/errorParser";
import { tryCatch } from "@/utils/try-catch";
import { PublicPageConnectButton } from "../../../_components/PublicPageConnectButton";
import { SupplyClaimedProgress } from "../../../_components/supply-claimed-progress";
import { TokenPrice } from "../../../_components/token-price";
import { getCurrencyMeta } from "../../_utils/getCurrencyMeta";

type ActiveClaimCondition = Awaited<ReturnType<typeof getActiveClaimCondition>>;

// TODO UI improvements - show how many tokens connected wallet can claim at max

export function TokenDropClaim(props: {
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
  const [quantity, setQuantity] = useState("1");
  const account = useActiveAccount();

  const sendAndConfirmApproveTx = useSendAndConfirmTx();
  const sendAndConfirmClaimTx = useSendAndConfirmTx();

  const [successScreen, setSuccessScreen] = useState<
    | undefined
    | {
        txHash: string;
      }
  >(undefined);

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
        from: account.address,
        quantity: String(quantity),
        to: account.address,
      });

      const approveTx = await getApprovalForTransaction({
        account,
        transaction,
      });

      if (approveTx) {
        setStepsUI({
          approve: "pending",
          claim: "idle",
        });

        const approveTxResult = await tryCatch(
          sendAndConfirmApproveTx.mutateAsync(approveTx),
        );

        if (approveTxResult.error) {
          console.error(approveTxResult.error);

          setStepsUI({
            approve: "error",
            claim: "idle",
          });

          const errorMessage = parseError(approveTxResult.error);

          reportAssetBuyFailed({
            assetType: "coin",
            chainId: props.contract.chain.id,
            contractType: "DropERC20",
            error: errorMessage,
          });

          toast.error("Failed to approve spending", {
            description: errorMessage,
          });
          return;
        }

        setStepsUI({
          approve: "success",
          claim: "pending",
        });
      }

      async function sendAndConfirm() {
        const result = await sendAndConfirmClaimTx.mutateAsync(transaction);
        return result;
      }

      setStepsUI({
        approve: approveTx ? "success" : undefined,
        claim: "pending",
      });

      const claimTxResult = await tryCatch(sendAndConfirm());
      if (claimTxResult.error) {
        console.error(claimTxResult.error);
        const errorMessage = parseError(claimTxResult.error);
        setStepsUI({
          approve: approveTx ? "success" : undefined,
          claim: "error",
        });

        reportAssetBuyFailed({
          assetType: "coin",
          chainId: props.contract.chain.id,
          contractType: "DropERC20",
          error: errorMessage,
        });

        toast.error("Failed to buy tokens", {
          description: errorMessage,
        });
        return;
      }

      reportAssetBuySuccessful({
        assetType: "coin",
        chainId: props.contract.chain.id,
        contractType: "DropERC20",
      });

      setStepsUI({
        approve: approveTx ? "success" : undefined,
        claim: "success",
      });

      setSuccessScreen({
        txHash: claimTxResult.data.transactionHash,
      });
    },
  });

  const publicPrice = {
    currencyAddress: props.claimCondition.currency,
    decimals: props.claimConditionCurrency.decimals,
    pricePerTokenWei: props.claimCondition.pricePerToken,
    symbol: props.claimConditionCurrency.symbol,
  };

  const claimParamsQuery = useQuery({
    queryFn: async () => {
      if (!account) {
        return publicPrice;
      }

      const merkleRoot = props.claimCondition.merkleRoot;
      if (!merkleRoot || merkleRoot === padHex("0x", { size: 32 })) {
        return publicPrice;
      }

      const claimParams = await getClaimParams({
        contract: props.contract,
        from: account.address,
        quantity: 1n, // not relevant
        to: account.address,
        tokenDecimals: props.decimals,
        type: "erc20",
      });

      const meta = await getCurrencyMeta({
        chain: props.contract.chain,
        chainMetadata: props.chainMetadata,
        client: props.contract.client,
        currencyAddress: claimParams.currency,
      });

      return {
        currencyAddress: claimParams.currency,
        decimals: meta.decimals,
        pricePerTokenWei: claimParams.pricePerToken,
        symbol: meta.symbol,
      };
    },
    queryKey: ["claim-params", props.contract.address, account?.address],
  });

  const claimParamsData = claimParamsQuery.data;

  const tokenAmountId = useId();

  if (successScreen) {
    const explorerUrl =
      props.chainMetadata.explorers?.[0]?.url ??
      `https://thirdweb.com/${props.chainMetadata.slug}`;

    return (
      <div className="rounded-xl border bg-card p-6">
        {/* icon */}
        <div className="flex justify-center py-8">
          <div className="rounded-full border bg-background p-3">
            <CheckIcon className="size-8" />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-1 text-center font-bold text-xl">
            Purchase Successful
          </h2>
          <p className="text-center text-muted-foreground text-sm">
            You have successfully purchased {quantity}{" "}
            {props.symbol || "tokens"}
          </p>
        </div>

        <Button asChild className="w-full bg-muted/50" variant="outline">
          <Link
            className="gap-1.5"
            href={`${explorerUrl}/tx/${successScreen.txHash}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View Transaction{" "}
            <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
          </Link>
        </Button>

        <Button
          className="mt-3 w-full"
          onClick={() => setSuccessScreen(undefined)}
        >
          Buy More
        </Button>
      </div>
    );
  }

  const isShowingCustomPrice =
    claimParamsData &&
    (claimParamsData.pricePerTokenWei !== publicPrice.pricePerTokenWei ||
      claimParamsData.currencyAddress !== publicPrice.currencyAddress);

  return (
    <div className="rounded-xl border bg-card ">
      <div className="border-b px-4 py-5 lg:px-5">
        <h2 className="font-semibold text-lg tracking-tight">
          Buy {props.symbol}
        </h2>
        <p className="text-muted-foreground text-sm">
          Buy tokens from the primary sale
        </p>
      </div>

      <div className="p-4 lg:p-5">
        <div>
          <div className="space-y-2">
            <Label htmlFor={tokenAmountId}>Tokens</Label>
            <PriceInput
              id={tokenAmountId}
              quantity={quantity}
              setQuantity={setQuantity}
              symbol={props.symbol}
            />
          </div>

          <div className="h-4" />

          <SupplyClaimedProgress
            claimedSupplyTokens={Number(
              toTokens(props.claimCondition.supplyClaimed, props.decimals),
            )}
            totalSupplyTokens={
              props.claimCondition.maxClaimableSupply === maxUint256
                ? "unlimited"
                : Number(
                    toTokens(
                      props.claimCondition.maxClaimableSupply,
                      props.decimals,
                    ),
                  )
            }
          />

          <div className="h-4" />

          <div className="space-y-3 rounded-lg bg-muted/50 p-3">
            {/* Price per token */}
            <div className="flex items-start justify-between font-medium text-sm">
              <span className="flex items-center gap-2">
                Price per token
                {isShowingCustomPrice && (
                  <ToolTipLabel label="Your connected wallet address is added in the allowlist and is getting a special price">
                    <CircleAlertIcon className="size-3.5 text-muted-foreground" />
                  </ToolTipLabel>
                )}
              </span>

              <div className="flex flex-col items-end gap-1">
                {/* public price */}
                {isShowingCustomPrice && (
                  <TokenPrice
                    data={{
                      priceInTokens: Number(
                        toTokens(
                          publicPrice.pricePerTokenWei,
                          publicPrice.decimals,
                        ),
                      ),
                      symbol: publicPrice.symbol,
                    }}
                    strikethrough={true}
                  />
                )}

                {/* price shown to user */}
                <TokenPrice
                  data={
                    claimParamsData
                      ? {
                          priceInTokens: Number(
                            toTokens(
                              claimParamsData.pricePerTokenWei,
                              claimParamsData.decimals,
                            ),
                          ),
                          symbol: claimParamsData.symbol,
                        }
                      : undefined
                  }
                  strikethrough={false}
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="flex justify-between font-medium text-sm">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>

            {/* Total Price */}
            <div className="border-active-border border-t border-dashed pt-4">
              <div className="flex justify-between font-semibold text-sm">
                <span>Total Price</span>
                <TokenPrice
                  data={
                    claimParamsData
                      ? {
                          priceInTokens:
                            Number(
                              toTokens(
                                claimParamsData.pricePerTokenWei,
                                claimParamsData.decimals,
                              ),
                            ) * Number(quantity),
                          symbol: claimParamsData.symbol,
                        }
                      : undefined
                  }
                  // don't strikethrough the total
                  strikethrough={false}
                />
              </div>
            </div>
          </div>

          <div className="h-6" />

          {account ? (
            <TransactionButton
              checkBalance={false}
              className="!w-full"
              client={props.contract.client}
              disabled={approveAndClaim.isPending || !claimParamsData}
              isLoggedIn={true}
              isPending={approveAndClaim.isPending}
              onClick={async () => {
                approveAndClaim.mutate();
              }}
              transactionCount={undefined}
              txChainID={props.contract.chain.id}
              variant="default"
            >
              Buy
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
                  <StepUI status={stepsUI.approve} title="Approve Spending" />
                )}

                {stepsUI.claim && (
                  <StepUI status={stepsUI.claim} title={"Buy Tokens"} />
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
  error: XIcon,
  idle: CircleIcon,
  pending: Spinner,
  success: CheckIcon,
};

function StepUI(props: { title: string; status: Status }) {
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
  quantity: string;
  setQuantity: (quantity: string) => void;
  id: string;
  symbol: string | undefined;
}) {
  return (
    <div className="relative">
      <DecimalInput
        className="!text-2xl h-auto truncate bg-muted/50 pr-14 font-bold"
        id={props.id}
        onChange={(value) => {
          props.setQuantity(value);
        }}
        value={String(props.quantity)}
      />
      {props.symbol && (
        <div className="-translate-y-1/2 absolute top-1/2 right-3 font-medium text-muted-foreground text-sm">
          {props.symbol}
        </div>
      )}
    </div>
  );
}
