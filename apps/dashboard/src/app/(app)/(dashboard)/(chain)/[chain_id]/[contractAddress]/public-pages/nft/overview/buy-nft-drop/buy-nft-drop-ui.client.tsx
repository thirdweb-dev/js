"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CircleAlertIcon } from "lucide-react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type { NFT, ThirdwebClient } from "thirdweb";
import { type ThirdwebContract, toTokens } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import type { getActiveClaimCondition } from "thirdweb/extensions/erc721";
import * as z from "zod";
import { CustomMediaRenderer } from "@/components/blocks/media-renderer";
import { TransactionButton } from "@/components/tx-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PublicPageConnectButton } from "../../../_components/PublicPageConnectButton";
import { SupplyClaimedProgress } from "../../../_components/supply-claimed-progress";
import { TokenPrice } from "../../../_components/token-price";
import { supplyFormatter } from "../../format";
import type {
  GetNFTDropClaimParams,
  GetNFTsToClaim,
} from "./buy-nft-drop.client";

type ActiveClaimCondition = Awaited<ReturnType<typeof getActiveClaimCondition>>;

export const buyNFTDropFormSchema = z.object({
  amount: z.coerce.number().int().gt(0),
});

export type BuyNFTDropForm = UseFormReturn<
  z.infer<typeof buyNFTDropFormSchema>
>;

const NFT_ASSET_PAGE_ERC721_QUERIES_KEY_ROOT = "nft-asset-page-erc721-queries";

export type BuyNFTDropUIProps = {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  claimCondition: ActiveClaimCondition & {
    decimals: number;
    symbol: string;
  };
  totalNFTs: number;
  nextTokenIdToClaim: bigint;
  totalUnclaimedSupply: bigint;
  onSuccess?: () => void;
  getNFTDropClaimParams: GetNFTDropClaimParams;
  getNFTsToClaim: GetNFTsToClaim;
  handleSubmit: (
    form: UseFormReturn<z.infer<typeof buyNFTDropFormSchema>>,
  ) => Promise<unknown>;
  activeAccountAddress: string | undefined;
};

export function BuyNFTDropUI(props: BuyNFTDropUIProps) {
  const form = useForm<z.infer<typeof buyNFTDropFormSchema>>({
    defaultValues: {
      amount: 1,
    },
    resolver: zodResolver(buyNFTDropFormSchema),
    reValidateMode: "onChange",
  });
  const nftAmountToClaim = Number(form.watch("amount"));

  const claimParamsQuery = useQuery({
    queryFn: async () => {
      if (!props.activeAccountAddress) {
        return publicPrice;
      }

      return props.getNFTDropClaimParams({
        accountAddress: props.activeAccountAddress,
        chainMetadata: props.chainMetadata,
        contract: props.contract,
      });
    },
    queryKey: [
      NFT_ASSET_PAGE_ERC721_QUERIES_KEY_ROOT,
      "erc721-claimParamsQuery",
      {
        accountAddress: props.activeAccountAddress,
        contract: props.contract,
      },
    ],
  });

  const publicPrice = {
    currencyAddress: props.claimCondition.currency,
    decimals: props.claimCondition.decimals,
    maxClaimableSupply: props.claimCondition.maxClaimableSupply,
    pricePerTokenWei: props.claimCondition.pricePerToken,
    symbol: props.claimCondition.symbol,
  };

  const isAmountValid = !form.formState.errors.amount;

  const nftsToClaimQuery = useQuery({
    enabled: isAmountValid,
    queryFn: async () => {
      return props.getNFTsToClaim({
        contract: props.contract,
        count: nftAmountToClaim,
        nextTokenIdToClaim: props.nextTokenIdToClaim,
      });
    },
    queryKey: [
      NFT_ASSET_PAGE_ERC721_QUERIES_KEY_ROOT,
      "erc721-nftsToClaimQuery",
      {
        contract: props.contract,
        count: nftAmountToClaim,
        start: props.nextTokenIdToClaim.toString(),
      },
    ],
  });

  const isShowingCustomPrice =
    claimParamsQuery.data &&
    (claimParamsQuery.data.pricePerTokenWei !== publicPrice.pricePerTokenWei ||
      claimParamsQuery.data.currencyAddress !== publicPrice.currencyAddress);

  const maxNFTsToShow = 15;
  const shouldTruncateNFTs = nftAmountToClaim > maxNFTsToShow;
  const nftsToShow = shouldTruncateNFTs
    ? nftsToClaimQuery.data?.slice(0, 14)
    : nftsToClaimQuery.data;

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(async () => {
          await props.handleSubmit(form);
        })}
      >
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
                  className="!text-2xl h-auto bg-muted/50 font-bold"
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    const value = Number.isNaN(num) ? 0 : num;
                    form.setValue("amount", value);

                    if (BigInt(value) > props.totalUnclaimedSupply) {
                      form.setError("amount", {
                        message: "Amount exceeds available supply",
                      });
                    } else {
                      form.clearErrors("amount");
                      form.trigger("amount");
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                {supplyFormatter.format(props.totalUnclaimedSupply)} NFTs
                available for purchase
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isAmountValid && (
          <div className="">
            <h2 className="mb-1 font-medium text-sm">
              NFT{nftAmountToClaim > 1 ? "s" : ""}
            </h2>
            <p className="mb-2 text-muted-foreground text-sm">
              {nftAmountToClaim === 1
                ? "You will receive this NFT"
                : `You will receive these ${nftAmountToClaim} NFTs`}
            </p>
            <div
              className={cn(
                "grid grid-cols-5 gap-1.5",
                nftAmountToClaim <= 3 && "grid-cols-3 gap-2",
                nftAmountToClaim === 4 && "grid-cols-4 gap-2",
              )}
            >
              {!nftsToClaimQuery.isPending &&
                nftsToShow?.map((nft) => (
                  <MiniNFTCard
                    client={props.contract.client}
                    data={nft}
                    key={nft.id}
                  />
                ))}

              {shouldTruncateNFTs && nftsToShow && (
                <div className="flex items-center justify-center rounded-lg border bg-muted/50 text-sm">
                  +{nftAmountToClaim - nftsToShow.length}
                </div>
              )}

              {nftsToClaimQuery.isPending &&
                nftAmountToClaim > 0 &&
                Array.from({
                  length: Math.min(nftAmountToClaim, maxNFTsToShow),
                }).map((_, index) => (
                  <MiniNFTCard
                    client={props.contract.client}
                    data={undefined}
                    // biome-ignore lint/suspicious/noArrayIndexKey: EXPECTED
                    key={index}
                  />
                ))}
            </div>
          </div>
        )}

        <SupplyClaimedProgress
          claimedSupplyTokens={Number(
            BigInt(props.totalNFTs) - props.totalUnclaimedSupply,
          )}
          totalSupplyTokens={Number(props.totalNFTs)}
        />

        <div className="flex flex-col gap-1.5 rounded-lg bg-muted/50 p-3">
          <div className="flex items-start justify-between font-medium text-sm ">
            <span className="flex items-center gap-2">
              Price per NFT
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
                  claimParamsQuery.data
                    ? {
                        priceInTokens: Number(
                          toTokens(
                            claimParamsQuery.data.pricePerTokenWei,
                            claimParamsQuery.data.decimals,
                          ),
                        ),
                        symbol: claimParamsQuery.data.symbol,
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
                claimParamsQuery.data
                  ? {
                      priceInTokens:
                        Number(
                          toTokens(
                            claimParamsQuery.data.pricePerTokenWei,
                            claimParamsQuery.data.decimals,
                          ),
                        ) * nftAmountToClaim,
                      symbol: claimParamsQuery.data.symbol,
                    }
                  : undefined
              }
              strikethrough={false}
            />
          </div>
        </div>

        {props.activeAccountAddress ? (
          <TransactionButton
            className="w-full"
            client={props.contract.client}
            isLoggedIn={true}
            isPending={form.formState.isSubmitting}
            transactionCount={undefined}
            txChainID={props.contract.chain.id}
            type="submit"
            variant="default"
          >
            Buy NFT{nftAmountToClaim > 1 ? "s" : ""}
          </TransactionButton>
        ) : (
          <PublicPageConnectButton connectButtonClassName="!w-full !py-2.5 !h-auto !text-sm" />
        )}
      </form>
    </Form>
  );
}

function MiniNFTCard(props: { data: NFT | undefined; client: ThirdwebClient }) {
  return (
    <ToolTipLabel
      label={
        props.data ? (
          <span className="flex flex-col">
            <span className="mb-3 border-b pb-3 text-muted-foreground text-xs">
              TOKEN #{props.data.id}
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-base text-foreground">
                {props.data.metadata.name?.toString() || ""}
              </span>
              <span className="text-muted-foreground text-sm">
                {props.data.metadata.description?.toString() || ""}
              </span>
            </div>
          </span>
        ) : undefined
      }
    >
      <div className="group relative flex-col overflow-hidden rounded-lg border">
        {/* image */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Skeleton className="absolute inset-0" />
          {props.data ? (
            <CustomMediaRenderer
              alt={props.data.metadata.name?.toString() || ""}
              className="aspect-square h-full w-full"
              client={props.client}
              poster={props.data.metadata.image}
              src={
                props.data.metadata.animation_url || props.data.metadata.image
              }
            />
          ) : (
            <Skeleton className="aspect-square h-full w-full" />
          )}
        </div>
      </div>
    </ToolTipLabel>
  );
}
