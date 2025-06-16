"use client";

import { Img } from "@/components/blocks/Img";
import { CustomMediaRenderer } from "@/components/blocks/media-renderer";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton, SkeletonContainer } from "@/components/ui/skeleton";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import {
  BoxIcon,
  CircleSlashIcon,
  ShoppingCartIcon,
  SparkleIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import type { NFT, ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getNFT as ERC721_getNFT } from "thirdweb/extensions/erc721";
import { getNFT as ERC1155_getNFT } from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { useERC1155ClaimCondition } from "../client-utils";
import { BuyEditionDrop } from "../overview/buy-edition-drop/buy-edition-drop.client";

export function TokenViewerSheet(
  props: {
    clientContract: ThirdwebContract;
    chainMetadata: ChainMetadata;
    collectionMetadata: {
      name: string;
      image?: string;
    };
    type: "erc1155" | "erc721";
    open: boolean;
    tokenByIndexSupported: boolean;
    onClose: () => void;
  } & (
    | {
        variant: "view-data";
        nft: NFT;
      }
    | {
        variant: "fetch-data";
        tokenId: bigint;
      }
  ),
) {
  const tokenId = props.variant === "fetch-data" ? props.tokenId : props.nft.id;

  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => {
        if (!open) {
          props.onClose();
        }
      }}
    >
      <DialogContent
        className="lg:!max-w-6xl !rounded-xl flex flex-col gap-0 p-0 max-sm:max-h-[calc(100dvh-60px)] max-sm:overflow-y-auto"
        dialogCloseClassName="bg-background p-2 opacity-100 rounded-full right-6 top-6 border focus:ring-0 lg:top-4 lg:right-4 "
      >
        <DialogHeader className="p-0">
          <DialogTitle className="sr-only">Token #{tokenId}</DialogTitle>
        </DialogHeader>

        {props.variant === "fetch-data" ? (
          <FetchAndRenderTokenInfo
            clientContract={props.clientContract}
            chainMetadata={props.chainMetadata}
            type={props.type}
            tokenId={props.tokenId}
            tokenByIndexSupported={props.tokenByIndexSupported}
            collectionMetadata={props.collectionMetadata}
          />
        ) : (
          <TokenInfoUI
            data={props.nft}
            contract={props.clientContract}
            type={props.type}
            tokenId={tokenId}
            chainMetadata={props.chainMetadata}
            collectionMetadata={props.collectionMetadata}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function FetchAndRenderTokenInfo(props: {
  clientContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  type: "erc1155" | "erc721";
  tokenId: bigint;
  tokenByIndexSupported: boolean;
  collectionMetadata: {
    name: string;
  };
}) {
  const nftQuery = useReadContract(
    props.type === "erc721" ? ERC721_getNFT : ERC1155_getNFT,
    {
      contract: props.clientContract,
      tokenId: props.tokenId,
      includeOwner: true,
      tokenByIndex: props.tokenByIndexSupported,
    },
  );

  if (nftQuery.isError) {
    return (
      <div className="flex grow flex-col items-center justify-center rounded-lg py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full border p-2">
            <XIcon className="size-5 text-muted-foreground" />
          </div>
          <p className="text-base text-foreground">
            No NFT found with Token #{props.tokenId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <TokenInfoUI
      data={nftQuery.data}
      contract={props.clientContract}
      type={props.type}
      tokenId={props.tokenId}
      chainMetadata={props.chainMetadata}
      collectionMetadata={props.collectionMetadata}
    />
  );
}

function TokenInfoUI(props: {
  data: NFT | undefined;
  contract: ThirdwebContract;
  type: "erc1155" | "erc721";
  chainMetadata: ChainMetadata;
  tokenId: bigint;
  collectionMetadata: {
    name: string;
    image?: string;
  };
}) {
  const attributes = props.data ? getAttributes(props.data) : [];
  const { claimCondition } = useERC1155ClaimCondition({
    chainMetadata: props.chainMetadata,
    tokenId: props.tokenId,
    contract: props.contract,
    enabled: props.type === "erc1155",
  });

  const isClaimable = !claimCondition.data
    ? undefined
    : claimCondition.data.supplyClaimed <
      claimCondition.data.maxClaimableSupply;

  return (
    <div className="grid grid-cols-1 items-center lg:grid-cols-[500px_1fr]">
      {/* left / top */}
      <div className="p-4 lg:p-2">
        {props.data ? (
          <CustomMediaRenderer
            client={props.contract.client}
            src={props.data.metadata.animation_url || props.data.metadata.image}
            alt={props.data.metadata.name?.toString() || ""}
            poster={props.data.metadata.image}
            className="[&>div]:!bg-accent [&_a]:!text-muted-foreground [&_a]:!no-underline [&_svg]:!size-6 [&_svg]:!text-muted-foreground aspect-square w-full rounded-lg"
          />
        ) : (
          <Skeleton className="aspect-square rounded-lg border" />
        )}
      </div>

      {/* right / bottom */}
      <ScrollShadow scrollableClassName="lg:max-h-[calc(100dvh-60px)]">
        <div className="space-y-4 p-4 max-sm:pt-0">
          <div className="space-y-2">
            {/* title */}
            <SkeletonContainer
              loadedData={props.data?.metadata.name}
              skeletonData="NFTCollection #0"
              render={(title) => (
                <h2 className="font-bold text-3xl tracking-tight">{title}</h2>
              )}
            />

            {/* description */}
            {props.data ? (
              props.data.metadata.description ? (
                <p className="line-clamp-3 text-muted-foreground text-sm">
                  {props.data.metadata.description}
                </p>
              ) : null
            ) : (
              <Skeleton className="h-14 w-full" />
            )}
          </div>

          {/* collection + owner */}
          <div className="flex flex-col gap-3 border-y border-dashed py-4 lg:flex-row lg:items-center lg:[&>*:not(:first-child)]:border-l lg:[&>*:not(:first-child)]:pl-3 ">
            <div className="flex items-center gap-1.5">
              <Img
                src={
                  props.collectionMetadata.image
                    ? resolveSchemeWithErrorHandler({
                        client: props.contract.client,
                        uri: props.collectionMetadata.image,
                      }) || ""
                    : ""
                }
                alt={props.collectionMetadata.name}
                fallback={
                  <BoxIcon className="size-3.5 text-muted-foreground" />
                }
                className="size-3.5 rounded-lg"
              />
              <span className="text-foreground text-sm ">
                {props.collectionMetadata.name}
              </span>
            </div>

            {!props.data ? (
              <Skeleton className="h-4 w-36" />
            ) : props.data?.owner ? (
              <div className="flex shrink-0 items-center gap-1.5 text-sm">
                <WalletIcon className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Owned by</span>
                <WalletAddress
                  address={props.data.owner}
                  client={props.contract.client}
                  iconClassName="hidden"
                  className="h-auto py-0 text-sm"
                  preventOpenOnFocus
                />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm">
                {isClaimable === false ? (
                  <CircleSlashIcon className="size-3.5" />
                ) : (
                  <ShoppingCartIcon className="size-3.5" />
                )}

                {props.type === "erc721" ? (
                  <span>Available For Purchase</span>
                ) : isClaimable === undefined ? (
                  <Skeleton className="h-4 w-36" />
                ) : (
                  <span>
                    {isClaimable
                      ? "Available For Purchase"
                      : "No supply left for purchase"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-muted/50 py-1 font-normal text-muted-foreground"
            >
              {props.type === "erc721" ? "ERC721" : "ERC1155"}
            </Badge>

            <Badge
              variant="outline"
              className="bg-muted/50 py-1 font-normal text-muted-foreground"
            >
              Token #{props.tokenId}
            </Badge>

            <Badge
              variant="outline"
              className="flex items-center gap-2 bg-muted/50 px-1.5 py-1 font-normal text-muted-foreground"
            >
              <Img
                src={
                  props.chainMetadata.icon?.url
                    ? resolveSchemeWithErrorHandler({
                        client: props.contract.client,
                        uri: props.chainMetadata.icon?.url,
                      })
                    : ""
                }
                alt={props.chainMetadata.name}
                className="size-3 rounded-full"
              />
              <span className="text-muted-foreground text-xs">
                {props.chainMetadata.name}
              </span>
            </Badge>
          </div>

          {/* attributes */}
          {attributes.length > 0 && (
            <div className="border-t border-dashed pt-4">
              <h3 className="mb-2 flex items-center gap-2 font-medium text-sm">
                Traits
                <span className="text-muted-foreground text-sm">
                  {attributes.length}
                </span>
              </h3>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {attributes.map((attribute) => (
                  <TraitCard
                    key={`${attribute.trait_type}-${attribute.value}`}
                    trait_type={attribute.trait_type}
                    value={attribute.value}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ERC1155 */}
          {props.type === "erc1155" && isClaimable !== false && (
            <div className="space-y-1.5 border-t border-dashed pt-4">
              <h3 className="font-semibold text-base text-foreground">
                Buy NFT
              </h3>
              <BuyEditionDrop
                contract={props.contract}
                tokenId={props.tokenId}
                chainMetadata={props.chainMetadata}
              />
            </div>
          )}
        </div>
      </ScrollShadow>
    </div>
  );
}

export function PageLoadTokenViewerSheet(props: {
  clientContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  type: "erc1155" | "erc721";
  tokenId: bigint;
  tokenByIndexSupported: boolean;
  collectionMetadata: {
    name: string;
  };
}) {
  const [open, setOpen] = useState(true);

  return (
    <TokenViewerSheet
      variant="fetch-data"
      clientContract={props.clientContract}
      chainMetadata={props.chainMetadata}
      type={props.type}
      tokenId={props.tokenId}
      open={open}
      tokenByIndexSupported={props.tokenByIndexSupported}
      onClose={() => setOpen(false)}
      collectionMetadata={props.collectionMetadata}
    />
  );
}

function getAttributes(nft: NFT) {
  const attributes: Array<{
    trait_type: string;
    value: string;
  }> = [];

  if (Array.isArray(nft.metadata.attributes)) {
    for (const attribute of nft.metadata.attributes) {
      if (
        typeof attribute.trait_type !== "string" ||
        typeof attribute.value !== "string"
      ) {
        continue;
      }

      attributes.push({
        trait_type: attribute.trait_type,
        value: attribute.value,
      });
    }
  } else if (
    typeof nft.metadata.attributes === "object" &&
    nft.metadata.attributes !== null
  ) {
    for (const key in nft.metadata.attributes) {
      if (typeof nft.metadata.attributes[key] !== "string") {
        continue;
      }

      attributes.push({
        trait_type: key,
        value: nft.metadata.attributes[key],
      });
    }
  }

  return attributes;
}

function TraitCard(props: {
  trait_type: string;
  value: string;
}) {
  return (
    <div className="relative rounded-md border bg-card px-3 py-2">
      <SparkleIcon className="absolute top-2 right-2 size-3 fill-muted-foreground text-muted-foreground opacity-30" />
      {props.trait_type && (
        <p className="mb-0.5 text-muted-foreground text-xs">
          {props.trait_type}
        </p>
      )}
      <p className="text-foreground text-xs">{props.value}</p>
    </div>
  );
}
