"use client";

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
import { Img } from "@/components/blocks/Img";
import { CustomMediaRenderer } from "@/components/blocks/media-renderer";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Skeleton, SkeletonContainer } from "@/components/ui/skeleton";
import { TabButtons } from "@/components/ui/tabs";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
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
      onOpenChange={(open) => {
        if (!open) {
          props.onClose();
        }
      }}
      open={props.open}
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
            chainMetadata={props.chainMetadata}
            clientContract={props.clientContract}
            collectionMetadata={props.collectionMetadata}
            tokenByIndexSupported={props.tokenByIndexSupported}
            tokenId={props.tokenId}
            type={props.type}
          />
        ) : (
          <TokenInfoUI
            chainMetadata={props.chainMetadata}
            collectionMetadata={props.collectionMetadata}
            contract={props.clientContract}
            data={props.nft}
            tokenId={tokenId}
            type={props.type}
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
      includeOwner: true,
      tokenByIndex: props.tokenByIndexSupported,
      tokenId: props.tokenId,
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
      chainMetadata={props.chainMetadata}
      collectionMetadata={props.collectionMetadata}
      contract={props.clientContract}
      data={nftQuery.data}
      tokenId={props.tokenId}
      type={props.type}
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
    contract: props.contract,
    enabled: props.type === "erc1155",
    tokenId: props.tokenId,
  });

  const [tab, setTab] = useState<"traits" | "buy">("traits");

  const noClaimConditionSet = !claimCondition.isPending && !claimCondition.data;

  const isClaimable = noClaimConditionSet
    ? false
    : !claimCondition.data
      ? undefined
      : claimCondition.data.supplyClaimed <
        claimCondition.data.maxClaimableSupply;

  const attributesUI =
    attributes.length > 0 ? (
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {attributes.map((attribute) => (
          <TraitCard
            key={`${attribute.trait_type}-${attribute.value}`}
            trait_type={attribute.trait_type}
            value={attribute.value}
          />
        ))}
      </div>
    ) : (
      <div className="border-t border-dashed pt-4">
        <p className="text-muted-foreground text-sm">No Traits</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 items-center lg:grid-cols-[500px_1fr]">
      {/* left / top */}
      <div className="p-4 lg:p-2">
        {props.data ? (
          <CustomMediaRenderer
            alt={props.data.metadata.name?.toString() || ""}
            className="[&>div]:!bg-accent [&_a]:!text-muted-foreground [&_a]:!no-underline [&_svg]:!size-6 [&_svg]:!text-muted-foreground aspect-square w-full rounded-lg"
            client={props.contract.client}
            poster={props.data.metadata.image}
            src={props.data.metadata.animation_url || props.data.metadata.image}
          />
        ) : (
          <Skeleton className="aspect-square rounded-lg border" />
        )}
      </div>

      {/* right / bottom */}
      <ScrollShadow scrollableClassName="lg:max-h-[calc(100dvh-60px)]">
        <DynamicHeight>
          <div className="space-y-4 p-4 max-sm:pt-0">
            <div className="space-y-2">
              {/* title */}
              <SkeletonContainer
                loadedData={props.data?.metadata.name}
                render={(title) => (
                  <h2 className="font-bold text-3xl tracking-tight">{title}</h2>
                )}
                skeletonData="NFTCollection #0"
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
                  alt={props.collectionMetadata.name}
                  className="size-3.5 rounded-lg"
                  fallback={
                    <BoxIcon className="size-3.5 text-muted-foreground" />
                  }
                  src={
                    props.collectionMetadata.image
                      ? resolveSchemeWithErrorHandler({
                          client: props.contract.client,
                          uri: props.collectionMetadata.image,
                        }) || ""
                      : ""
                  }
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
                    className="h-auto py-0 text-sm"
                    client={props.contract.client}
                    iconClassName="hidden"
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
                      {noClaimConditionSet
                        ? "Not available for purchase"
                        : isClaimable
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
                className="bg-muted/50 py-1 font-normal text-muted-foreground"
                variant="outline"
              >
                {props.type === "erc721" ? "ERC721" : "ERC1155"}
              </Badge>

              <Badge
                className="bg-muted/50 py-1 font-normal text-muted-foreground"
                variant="outline"
              >
                Token #{props.tokenId}
              </Badge>

              <Badge
                className="flex items-center gap-2 bg-muted/50 px-1.5 py-1 font-normal text-muted-foreground"
                variant="outline"
              >
                <Img
                  alt={props.chainMetadata.name}
                  className="size-3 rounded-full"
                  src={
                    props.chainMetadata.icon?.url
                      ? resolveSchemeWithErrorHandler({
                          client: props.contract.client,
                          uri: props.chainMetadata.icon?.url,
                        })
                      : ""
                  }
                />
                <span className="text-muted-foreground text-xs">
                  {props.chainMetadata.name}
                </span>
              </Badge>
            </div>

            {/* ERC1155 */}
            {props.type === "erc1155" && (
              <div className="border-t border-dashed pt-2">
                <TabButtons
                  tabClassName="!text-sm"
                  tabs={[
                    {
                      isActive: tab === "traits",
                      name: "Traits",
                      onClick: () => setTab("traits"),
                    },
                    {
                      isActive: tab === "buy",
                      name: "Buy NFT",
                      onClick: () => setTab("buy"),
                    },
                  ]}
                />

                <div className="h-2" />
                {tab === "traits" && attributesUI}
                {tab === "buy" && (
                  <div>
                    {isClaimable === false ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-muted-foreground text-sm">
                          Not available for purchase
                        </p>
                      </div>
                    ) : (
                      <BuyEditionDrop
                        chainMetadata={props.chainMetadata}
                        contract={props.contract}
                        tokenId={props.tokenId}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {props.type === "erc721" && (
              <div>
                <div className="border-t border-dashed pt-4">
                  <h3 className="mb-2 flex items-center gap-2 font-medium text-sm">
                    Traits
                    <span className="text-muted-foreground text-sm">
                      {attributes.length}
                    </span>
                  </h3>
                  {attributesUI}
                </div>
              </div>
            )}
          </div>
        </DynamicHeight>
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
      chainMetadata={props.chainMetadata}
      clientContract={props.clientContract}
      collectionMetadata={props.collectionMetadata}
      onClose={() => setOpen(false)}
      open={open}
      tokenByIndexSupported={props.tokenByIndexSupported}
      tokenId={props.tokenId}
      type={props.type}
      variant="fetch-data"
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

function TraitCard(props: { trait_type: string; value: string }) {
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
