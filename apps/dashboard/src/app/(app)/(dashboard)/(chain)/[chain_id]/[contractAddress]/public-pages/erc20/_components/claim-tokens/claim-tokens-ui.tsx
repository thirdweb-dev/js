"use client";
import { reportAssetBuy } from "@/analytics/report";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { DecimalInput } from "@/components/ui/decimal-input";
import { Label } from "@/components/ui/label";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  CheckIcon,
  CircleAlertIcon,
  CircleIcon,
  ExternalLinkIcon,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
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
import { parseError } from "utils/errorParser";
import { tryCatch } from "utils/try-catch";
import { getSDKTheme } from "../../../../../../../../components/sdk-component-theme";
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

  const { theme } = useTheme();

  const sendClaimTx = useSendTransaction({
    payModal: {
      theme: getSDKTheme(theme === "light" ? "light" : "dark"),
    },
  });

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

  function report(
    params:
      | {
          status: "attempted" | "successful";
        }
      | {
          status: "failed";
          errorMessage: string;
        },
  ) {
    reportAssetBuy({
      chainId: props.contract.chain.id,
      assetType: "Coin",
      contractType: "DropERC20",
      ...(params.status === "failed"
        ? {
            status: "failed",
            error: params.errorMessage,
          }
        : {
            status: "attempted",
          }),
    });
  }

  const approveAndClaim = useMutation({
    mutationFn: async () => {
      if (!account) {
        toast.error("Wallet is not connected");
        return;
      }

      report({
        status: "attempted",
      });

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
          console.error(approveTxResult.error);

          setStepsUI({
            approve: "error",
            claim: "idle",
          });

          const errorMessage = parseError(approveTxResult.error);

          report({
            status: "failed",
            errorMessage,
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
        const result = await sendClaimTx.mutateAsync(transaction);
        return await waitForReceipt(result);
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

        report({
          status: "failed",
          errorMessage,
        });

        toast.error("Failed to buy tokens", {
          description: errorMessage,
        });
        return;
      }

      report({
        status: "successful",
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
    pricePerTokenWei: props.claimCondition.pricePerToken,
    currencyAddress: props.claimCondition.currency,
    decimals: props.claimConditionCurrency.decimals,
    symbol: props.claimConditionCurrency.symbol,
  };

  const claimParamsQuery = useQuery({
    queryKey: ["claim-params", props.contract.address, account?.address],
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
        to: account.address,
        quantity: 1n, // not relevant
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

        <Button className="w-full bg-muted/50" variant="outline" asChild>
          <Link
            href={`${explorerUrl}/tx/${successScreen.txHash}`}
            target="_blank"
            className="gap-1.5"
            rel="noopener noreferrer"
          >
            View Transaction{" "}
            <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
          </Link>
        </Button>

        <Button
          onClick={() => setSuccessScreen(undefined)}
          className="mt-3 w-full"
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
            <Label htmlFor="token-amount">Tokens</Label>
            <PriceInput
              quantity={quantity}
              setQuantity={setQuantity}
              id="token-amount"
              symbol={props.symbol}
            />
          </div>

          <div className="h-4" />

          <SupplyClaimedProgress
            claimedSupply={BigInt(
              toTokens(props.claimCondition.supplyClaimed, props.decimals),
            )}
            totalSupply={BigInt(
              toTokens(props.claimCondition.maxClaimableSupply, props.decimals),
            )}
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
                      symbol: publicPrice.symbol,
                      priceInTokens: Number(
                        toTokens(
                          publicPrice.pricePerTokenWei,
                          publicPrice.decimals,
                        ),
                      ),
                    }}
                    strikethrough={true}
                  />
                )}

                {/* price shown to user */}
                <TokenPrice
                  data={
                    claimParamsData
                      ? {
                          symbol: claimParamsData.symbol,
                          priceInTokens: Number(
                            toTokens(
                              claimParamsData.pricePerTokenWei,
                              claimParamsData.decimals,
                            ),
                          ),
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
              client={props.contract.client}
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
  quantity: string;
  setQuantity: (quantity: string) => void;
  id: string;
  symbol: string | undefined;
}) {
  return (
    <div className="relative">
      <DecimalInput
        id={props.id}
        value={String(props.quantity)}
        onChange={(value) => {
          props.setQuantity(value);
        }}
        className="!text-2xl h-auto truncate bg-muted/50 pr-14 font-bold"
      />
      {props.symbol && (
        <div className="-translate-y-1/2 absolute top-1/2 right-3 font-medium text-muted-foreground text-sm">
          {props.symbol}
        </div>
      )}
    </div>
  );
}
