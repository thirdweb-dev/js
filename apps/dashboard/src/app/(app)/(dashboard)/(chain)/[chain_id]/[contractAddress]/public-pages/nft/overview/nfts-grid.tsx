"use client";

import { CheckCheckIcon } from "lucide-react";
import { useState } from "react";
import { type NFT, type ThirdwebContract, toTokens } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { maxUint256 } from "thirdweb/utils";
import { CustomMediaRenderer } from "@/components/blocks/media-renderer";
import { PaginationButtons } from "@/components/pagination-buttons";
import { Skeleton, SkeletonContainer } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TokenPrice } from "../../_components/token-price";
import { useERC1155ClaimCondition } from "../client-utils";
import { supplyFormatter } from "../format";
import { TokenViewerSheet } from "../token-viewer/token-viewer";

const pageSize = 48;

export function NFTsGrid(props: {
  isTokenByIndexSupported: boolean;
  type: "erc1155" | "erc721";
  clientContract: ThirdwebContract;
  gridClassName?: string;
  chainMetadata: ChainMetadata;
  totalNFTCount: number;
  collectionMetadata: {
    name: string;
  };
}) {
  const [page, setPage] = useState(1);
  const start = (page - 1) * pageSize;
  const [viewToken, setViewToken] = useState<
    | {
        nft: NFT;
        open: boolean;
      }
    | undefined
  >(undefined);

  const nftsQuery = useReadContract(
    props.type === "erc1155" ? ERC1155Ext.getNFTs : ERC721Ext.getNFTs,
    {
      contract: props.clientContract,
      count: pageSize,
      includeOwners: true,
      start,
      tokenByIndex: props.isTokenByIndexSupported,
    },
  );

  const totalPages = Math.ceil(Number(props.totalNFTCount) / pageSize);

  const showPagination = totalPages > 1;
  const contractLayoutPath = `/${props.chainMetadata.slug}/${props.clientContract.address}`;

  function handleNFTCardClick(nft: NFT) {
    setViewToken({
      nft,
      open: true,
    });
    window.history.replaceState(
      {},
      "",
      `${contractLayoutPath}/nfts/${nft.id.toString()}`,
    );
  }

  const showGrid =
    nftsQuery.isPending || (nftsQuery.data && nftsQuery.data.length > 0);

  return (
    <div className="flex grow flex-col">
      {viewToken && (
        <TokenViewerSheet
          chainMetadata={props.chainMetadata}
          clientContract={props.clientContract}
          collectionMetadata={props.collectionMetadata}
          nft={viewToken.nft}
          onClose={() => {
            window.history.replaceState({}, "", `${contractLayoutPath}`);
            setViewToken({
              nft: viewToken.nft,
              open: false,
            });
          }}
          open={viewToken.open}
          tokenByIndexSupported={props.isTokenByIndexSupported}
          type={props.type}
          variant="view-data"
        />
      )}

      {!nftsQuery.isPending && nftsQuery.data?.length === 0 && (
        <div className="flex grow flex-col items-center justify-center rounded-lg border border-dashed py-20">
          <p className="text-muted-foreground text-sm">No NFTs </p>
        </div>
      )}

      {showGrid && (
        <NFTGridContainer gridClassName={props.gridClassName}>
          {!nftsQuery.isPending &&
            nftsQuery.data?.map((nft) => (
              <NFTCard
                chainMetadata={props.chainMetadata}
                clientContract={props.clientContract}
                contractLayoutPath={contractLayoutPath}
                data={nft}
                key={nft.id}
                onClick={() => handleNFTCardClick(nft)}
                tokenId={nft.id}
                type={props.type}
              />
            ))}

          {nftsQuery.isPending &&
            Array.from({ length: pageSize }).map((_, idx) => (
              <NFTCard
                chainMetadata={props.chainMetadata}
                clientContract={props.clientContract}
                contractLayoutPath={contractLayoutPath}
                data={undefined}
                // biome-ignore lint/suspicious/noArrayIndexKey: idx is not relevant
                key={idx}
                tokenId={0n}
                type={props.type}
              />
            ))}
        </NFTGridContainer>
      )}

      {showPagination && (
        <div className="pt-6">
          <div className="flex justify-start">
            <PaginationButtons
              activePage={page}
              className="mx-0 w-auto"
              onPageClick={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function NFTGridContainer(props: {
  children: React.ReactNode;
  gridClassName?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        props.gridClassName,
      )}
    >
      {props.children}
    </div>
  );
}

export function NFTGridSkeleton(props: {
  clientContract: ThirdwebContract;
  gridClassName?: string;
  chainMetadata: ChainMetadata;
  type: "erc1155" | "erc721";
}) {
  return (
    <NFTGridContainer gridClassName={props.gridClassName}>
      {Array.from({ length: pageSize }).map((_, idx) => (
        <NFTCard
          chainMetadata={props.chainMetadata}
          clientContract={props.clientContract}
          contractLayoutPath={""}
          data={undefined}
          // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
          key={idx}
          tokenId={0n}
          type={props.type}
        />
      ))}
    </NFTGridContainer>
  );
}

function NFTCard(props: {
  data: NFT | undefined;
  tokenId: bigint;
  contractLayoutPath: string;
  onClick?: () => void;
  type: "erc1155" | "erc721";
  chainMetadata: ChainMetadata;
  clientContract: ThirdwebContract;
}) {
  return (
    <div
      className="group hover:-translate-y-0.5 relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border bg-card duration-200 hover:scale-[1.01] hover:border-active-border"
      onClick={props.onClick}
      onKeyDown={
        props.onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                props.onClick?.();
              }
            }
          : undefined
      }
      // biome-ignore lint/a11y/useSemanticElements: FIXME
      role="button"
      tabIndex={props.onClick ? 0 : undefined}
    >
      {/* image */}
      <div className="relative aspect-square w-full overflow-hidden">
        {props.data ? (
          <CustomMediaRenderer
            alt={props.data.metadata.name?.toString() || ""}
            className="aspect-square h-full w-full"
            client={props.clientContract.client}
            poster={props.data.metadata.image}
            src={props.data.metadata.animation_url || props.data.metadata.image}
          />
        ) : (
          <Skeleton className="aspect-square h-full w-full" />
        )}
      </div>

      <div className="space-y-1 border-t p-3">
        {/* title */}
        {props.data ? (
          <h2 className="font-semibold">{props.data.metadata.name}</h2>
        ) : (
          <Skeleton className="h-5 w-1/2" />
        )}

        {/* description  */}
        {props.type === "erc721" && (
          <>
            {props.data && props.data.type === "ERC721" ? (
              props.data.metadata.description ? (
                <p className="line-clamp-3 text-muted-foreground text-xs">
                  {props.data.metadata.description}
                </p>
              ) : null
            ) : (
              <Skeleton className="h-[60px]" />
            )}{" "}
          </>
        )}

        {props.type === "erc1155" && (
          <RenderClaimConditionInfo
            chainMetadata={props.chainMetadata}
            contract={props.clientContract}
            isSkeleton={!props.data}
            tokenId={props.tokenId}
          />
        )}
      </div>
    </div>
  );
}

function RenderClaimConditionInfo(props: {
  chainMetadata: ChainMetadata;
  tokenId: bigint;
  contract: ThirdwebContract;
  isSkeleton: boolean;
}) {
  const {
    isUserPriceDifferent,
    publicPriceQuery,
    userPriceQuery,
    claimCondition,
  } = useERC1155ClaimCondition({
    chainMetadata: props.chainMetadata,
    contract: props.contract,
    enabled: !props.isSkeleton,
    tokenId: props.tokenId,
  });

  const noClaimConditionSet = !claimCondition.isPending && !claimCondition.data;

  if (noClaimConditionSet) {
    return (
      <div>
        <p className="text-muted-foreground text-sm">
          Not available for purchase
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className="flex items-center gap-1.5">
        {/* public price */}
        {isUserPriceDifferent && (
          <ToolTipLabel label="Your connected wallet address is added in the allowlist and is getting a special price">
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
          </ToolTipLabel>
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

      <SkeletonContainer
        loadedData={
          claimCondition.data
            ? {
                maxClaimableSupply: claimCondition.data?.maxClaimableSupply,
                supplyClaimed: claimCondition.data?.supplyClaimed,
              }
            : undefined
        }
        render={(value) => {
          const isFullyClaimed =
            value.supplyClaimed === value.maxClaimableSupply;
          return (
            <div className="flex items-center gap-1.5">
              <p className="font-medium text-muted-foreground text-xs">
                {supplyFormatter.format(value.supplyClaimed)} /{" "}
                {value.maxClaimableSupply === maxUint256
                  ? "Unlimited"
                  : supplyFormatter.format(value.maxClaimableSupply)}{" "}
                bought
              </p>
              {isFullyClaimed && (
                <CheckCheckIcon className="size-4 text-muted-foreground" />
              )}
            </div>
          );
        }}
        skeletonData={{
          maxClaimableSupply: 100n,
          supplyClaimed: 10n,
        }}
      />
    </div>
  );
}
