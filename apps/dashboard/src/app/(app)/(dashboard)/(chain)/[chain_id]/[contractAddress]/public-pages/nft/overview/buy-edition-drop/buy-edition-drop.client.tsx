"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { CircleAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, toTokens } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo } from "thirdweb/extensions/erc1155";
import {
  useActiveAccount,
  useActiveWallet,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { parseError } from "utils/errorParser";
import * as z from "zod";
import { PublicPageConnectButton } from "../../../_components/PublicPageConnectButton";
import { SupplyClaimedProgress } from "../../../_components/supply-claimed-progress";
import { TokenPrice } from "../../../_components/token-price";
import {
  ASSET_PAGE_ERC1155_QUERIES_ROOT_KEY,
  useERC1155ClaimCondition,
} from "../../client-utils";

const formSchema = z.object({
  amount: z.coerce.number().int().gt(0),
});

type BuyEditionDropProps = {
  contract: ThirdwebContract;
  tokenId: bigint;
  onSuccess?: () => void;
  chainMetadata: ChainMetadata;
};

export function BuyEditionDrop(props: BuyEditionDropProps) {
  const trackEvent = useTrack();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1,
    },
    reValidateMode: "onChange",
  });
  const nftAmountToClaim = Number(form.watch("amount"));
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const queryClient = useQueryClient();

  const {
    claimCondition,
    userPriceQuery,
    publicPriceQuery,
    isUserPriceDifferent,
  } = useERC1155ClaimCondition({
    chainMetadata: props.chainMetadata,
    tokenId: props.tokenId,
    contract: props.contract,
    enabled: true,
  });

  function trackAssetBuy(
    params:
      | {
          type: "attempt" | "success";
        }
      | {
          type: "error";
          errorMessage: string;
        },
  ) {
    trackEvent({
      category: "asset",
      action: "buy",
      label: params.type,
      contractType: "NFTCollection",
      ercType: "erc1155",
      accountAddress: account?.address,
      walletId: activeWallet?.id,
      chainId: props.contract.chain.id,
      ...(params.type === "error"
        ? {
            errorMessage: params.errorMessage,
          }
        : {}),
    });
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      trackAssetBuy({
        type: "attempt",
      });

      if (!account) {
        return toast.error("No account detected");
      }

      const transaction = claimTo({
        contract: props.contract,
        to: account.address,
        quantity: BigInt(data.amount),
        from: account.address,
        tokenId: props.tokenId,
      });

      const approveTx = await getApprovalForTransaction({
        transaction,
        account,
      });

      if (approveTx) {
        const approveTxPromise = sendAndConfirmTx.mutateAsync(approveTx, {
          onError: (error) => {
            console.error(error);
          },
        });

        toast.promise(approveTxPromise, {
          loading: "Requesting approval to spend ERC20 tokens for NFT purchase",
          success: "ERC20 token spending request approved successfully",
          error: (err) => ({
            message: "Approval to spend ERC20 tokens failed",
            description: parseError(err),
          }),
        });

        try {
          await approveTxPromise;
        } catch (err) {
          const errorMessage = parseError(err);
          trackAssetBuy({
            type: "error",
            errorMessage:
              typeof errorMessage === "string" ? errorMessage : "Unknown error",
          });
          return;
        }
      }

      const claimTxPromise = sendAndConfirmTx.mutateAsync(transaction);

      const nftOrNfts = nftAmountToClaim > 1 ? "NFTs" : "NFT";

      toast.promise(claimTxPromise, {
        loading: `Buying ${nftAmountToClaim} ${nftOrNfts}`,
        success: `${nftOrNfts} bought successfully`,
        error: (err) => ({
          message: `Failed to buy ${nftAmountToClaim} ${nftOrNfts}`,
          description: parseError(err),
        }),
      });

      try {
        await claimTxPromise;

        trackAssetBuy({
          type: "success",
        });

        props.onSuccess?.();

        queryClient.invalidateQueries({
          queryKey: [ASSET_PAGE_ERC1155_QUERIES_ROOT_KEY],
        });
      } catch (err) {
        const errorMessage = parseError(err);
        trackAssetBuy({
          type: "error",
          errorMessage:
            typeof errorMessage === "string" ? errorMessage : "Unknown error",
        });
        return;
      }
    } catch (err) {
      const errorMessage = parseError(err);
      toast.error("Failed to buy NFTs", {
        description:
          typeof errorMessage === "string" ? errorMessage : undefined,
      });
      trackAssetBuy({
        type: "error",
        errorMessage:
          typeof errorMessage === "string" ? errorMessage : "Unknown error",
      });
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  type="text"
                  {...field}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    const value = Number.isNaN(num) ? 0 : num;
                    form.setValue("amount", value);

                    if (claimCondition.data) {
                      const remainingSupply =
                        claimCondition.data.maxClaimableSupply -
                        claimCondition.data.supplyClaimed;
                      if (value > remainingSupply) {
                        form.setError("amount", {
                          message: "Amount exceeds available supply",
                        });
                      } else {
                        form.clearErrors("amount");
                        form.trigger("amount");
                      }
                    }
                  }}
                  className="!text-2xl h-auto bg-muted/50 font-bold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {claimCondition.data ? (
          <SupplyClaimedProgress
            claimedSupply={claimCondition.data.supplyClaimed}
            totalSupply={claimCondition.data.maxClaimableSupply}
          />
        ) : (
          <Skeleton className="h-[62px] w-full" />
        )}

        <div className="flex flex-col gap-1.5 rounded-lg bg-muted/50 p-3">
          <div className="flex items-start justify-between font-medium text-sm ">
            <span className="flex items-center gap-2">
              Price per NFT
              {isUserPriceDifferent && (
                <ToolTipLabel label="Your connected wallet address is added in the allowlist and is getting a special price">
                  <CircleAlertIcon className="size-3.5 text-muted-foreground" />
                </ToolTipLabel>
              )}
            </span>
            <div className="flex gap-3">
              {/* public price */}
              {isUserPriceDifferent && (
                <TokenPrice
                  data={
                    publicPriceQuery.data
                      ? {
                          priceInTokens: Number(
                            toTokens(
                              publicPriceQuery.data.pricePerTokenWei,
                              publicPriceQuery.data.decimals,
                            ),
                          ),
                          symbol: publicPriceQuery.data.symbol,
                        }
                      : undefined
                  }
                  strikethrough={true}
                />
              )}

              {/* price shown to user */}
              <TokenPrice
                data={
                  userPriceQuery.data
                    ? {
                        priceInTokens: Number(
                          toTokens(
                            userPriceQuery.data.pricePerTokenWei,
                            userPriceQuery.data.decimals,
                          ),
                        ),
                        symbol: userPriceQuery.data.symbol,
                      }
                    : undefined
                }
                strikethrough={false}
              />
            </div>
          </div>

          <div className="flex items-start justify-between font-medium text-sm ">
            <span>Quantity</span>
            <span className="font-medium">{nftAmountToClaim}</span>
          </div>

          <div className="mt-2 flex items-start justify-between border-t border-dashed pt-3 font-medium text-sm">
            <span>Total Price</span>
            <TokenPrice
              data={
                userPriceQuery.data
                  ? {
                      priceInTokens:
                        Number(
                          toTokens(
                            userPriceQuery.data.pricePerTokenWei,
                            userPriceQuery.data.decimals,
                          ),
                        ) * nftAmountToClaim,
                      symbol: userPriceQuery.data.symbol,
                    }
                  : undefined
              }
              strikethrough={false}
            />
          </div>
        </div>
        {account ? (
          <TransactionButton
            client={props.contract.client}
            isLoggedIn={true}
            txChainID={props.contract.chain.id}
            transactionCount={undefined}
            isPending={form.formState.isSubmitting}
            type="submit"
            variant="default"
            className="w-full"
          >
            Buy NFT{nftAmountToClaim > 1 ? "s" : ""}
          </TransactionButton>
        ) : (
          <PublicPageConnectButton connectButtonClassName="!w-full" />
        )}
      </form>
    </Form>
  );
}
