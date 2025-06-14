"use client";

import { CustomMediaRenderer } from "@/components/blocks/media-renderer";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { CircleAlertIcon } from "lucide-react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { type ThirdwebContract, toTokens } from "thirdweb";
import type { NFT, ThirdwebClient } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import type { getActiveClaimCondition } from "thirdweb/extensions/erc721";
import * as z from "zod";
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
    resolver: zodResolver(buyNFTDropFormSchema),
    defaultValues: {
      amount: 1,
    },
    reValidateMode: "onChange",
  });
  const nftAmountToClaim = Number(form.watch("amount"));

  const claimParamsQuery = useQuery({
    queryKey: [
      NFT_ASSET_PAGE_ERC721_QUERIES_KEY_ROOT,
      "erc721-claimParamsQuery",
      {
        contract: props.contract,
        accountAddress: props.activeAccountAddress,
      },
    ],
    queryFn: async () => {
      if (!props.activeAccountAddress) {
        return publicPrice;
      }

      return props.getNFTDropClaimParams({
        contract: props.contract,
        chainMetadata: props.chainMetadata,
        accountAddress: props.activeAccountAddress,
      });
    },
  });

  const publicPrice = {
    pricePerTokenWei: props.claimCondition.pricePerToken,
    currencyAddress: props.claimCondition.currency,
    decimals: props.claimCondition.decimals,
    symbol: props.claimCondition.symbol,
    maxClaimableSupply: props.claimCondition.maxClaimableSupply,
  };

  const isAmountValid = !form.formState.errors.amount;

  const nftsToClaimQuery = useQuery({
    queryKey: [
      NFT_ASSET_PAGE_ERC721_QUERIES_KEY_ROOT,
      "erc721-nftsToClaimQuery",
      {
        contract: props.contract,
        start: props.nextTokenIdToClaim.toString(),
        count: nftAmountToClaim,
      },
    ],
    enabled: isAmountValid,
    queryFn: async () => {
      return props.getNFTsToClaim({
        contract: props.contract,
        nextTokenIdToClaim: props.nextTokenIdToClaim,
        count: nftAmountToClaim,
      });
    },
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
                  className="!text-2xl h-auto bg-muted/50 font-bold"
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
                    key={nft.id}
                    data={nft}
                    client={props.contract.client}
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
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    data={undefined}
                    client={props.contract.client}
                  />
                ))}
            </div>
          </div>
        )}

        <SupplyClaimedProgress
          claimedSupply={BigInt(props.totalNFTs) - props.totalUnclaimedSupply}
          totalSupply={BigInt(props.totalNFTs)}
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
          <PublicPageConnectButton connectButtonClassName="!w-full !py-2.5 !h-auto !text-sm" />
        )}
      </form>
    </Form>
  );
}

function MiniNFTCard(props: {
  data: NFT | undefined;
  client: ThirdwebClient;
}) {
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
              client={props.client}
              src={
                props.data.metadata.animation_url || props.data.metadata.image
              }
              alt={props.data.metadata.name?.toString() || ""}
              poster={props.data.metadata.image}
              className="aspect-square h-full w-full"
            />
          ) : (
            <Skeleton className="aspect-square h-full w-full" />
          )}
        </div>
      </div>
    </ToolTipLabel>
  );
}
