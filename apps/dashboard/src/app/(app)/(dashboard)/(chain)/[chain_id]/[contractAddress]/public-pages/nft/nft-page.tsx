import { ResponsiveLayout } from "@/components/Responsive";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isTokenByIndexSupported } from "thirdweb/extensions/erc721";
import { resolveFunctionSelectors } from "../../../../../../../../lib/selectors";
import { NFTPublicPageLayout } from "./nft-page-layout";
import {
  BuyNFTDropCardServer,
  getNFTDropClaimParams,
} from "./overview/buy-nft-drop/buy-nft-drop-card.server";
import { NFTGridSkeleton, NFTsGrid } from "./overview/nfts-grid";
import { NFTPublicPageTabs } from "./overview/tabs";
import { PageLoadTokenViewerSheet } from "./token-viewer/token-viewer";
import { getTotalNFTCount } from "./utils";

export async function NFTPublicPage(props: {
  serverContract: ThirdwebContract;
  clientContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  type: "erc1155" | "erc721";
  tokenId: string | undefined;
}) {
  const [contractMetadata, functionSelectors, totalNFTCount] =
    await Promise.all([
      getContractMetadata({
        contract: props.serverContract,
      }),
      resolveFunctionSelectors(props.serverContract),
      getTotalNFTCount({
        type: props.type,
        contract: props.serverContract,
      }),
    ]);

  const nftDropClaimParams =
    props.type === "erc721"
      ? await getNFTDropClaimParams({
          serverContract: props.serverContract,
          chainMetadata: props.chainMetadata,
          functionSelectors,
          totalNFTCount,
        })
      : undefined;

  const _isTokenByIndexSupported =
    props.type === "erc721" && isTokenByIndexSupported(functionSelectors);

  const buyNFTDropCard = nftDropClaimParams ? (
    <BuyNFTDropCardServer
      serverContract={props.serverContract}
      chainMetadata={props.chainMetadata}
      functionSelectors={functionSelectors}
      totalNFTCount={totalNFTCount}
      clientContract={props.clientContract}
      erc721ActiveClaimCondition={nftDropClaimParams.erc721ActiveClaimCondition}
      erc721ClaimConditionCurrencyMeta={
        nftDropClaimParams.erc721ClaimConditionCurrencyMeta
      }
      erc721NextTokenIdToClaim={nftDropClaimParams.erc721NextTokenIdToClaim}
      erc721TotalUnclaimedSupply={nftDropClaimParams.erc721TotalUnclaimedSupply}
    />
  ) : null;

  const nftsGrid = (
    <NFTsGrid
      isTokenByIndexSupported={_isTokenByIndexSupported}
      collectionMetadata={contractMetadata}
      type={props.type}
      clientContract={props.clientContract}
      chainMetadata={props.chainMetadata}
      totalNFTCount={totalNFTCount}
      gridClassName={
        buyNFTDropCard
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : undefined
      }
    />
  );

  const nftGridSkeleton = (
    <NFTGridSkeleton
      clientContract={props.clientContract}
      chainMetadata={props.chainMetadata}
      type={props.type}
      gridClassName={
        buyNFTDropCard
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : undefined
      }
    />
  );

  const buyEmbedSkeleton = buyNFTDropCard ? (
    <Skeleton className="h-[620px] border" />
  ) : null;

  return (
    <NFTPublicPageLayout
      clientContract={props.clientContract}
      chainMetadata={props.chainMetadata}
      contractMetadata={contractMetadata}
    >
      <ResponsiveLayout
        fallback={
          <div className="flex grow flex-col">
            <DesktopLayout
              className="max-sm:hidden"
              nftsGrid={nftGridSkeleton}
              buyEmbed={buyEmbedSkeleton}
            />

            <MobileLayout
              className="sm:hidden"
              nftsGrid={nftGridSkeleton}
              buyEmbed={buyEmbedSkeleton}
            />
          </div>
        }
        desktop={
          <DesktopLayout nftsGrid={nftsGrid} buyEmbed={buyNFTDropCard} />
        }
        mobile={<MobileLayout nftsGrid={nftsGrid} buyEmbed={buyNFTDropCard} />}
      />
      {props.tokenId && (
        <PageLoadTokenViewerSheet
          clientContract={props.clientContract}
          chainMetadata={props.chainMetadata}
          type={props.type}
          tokenId={BigInt(props.tokenId)}
          tokenByIndexSupported={_isTokenByIndexSupported}
          collectionMetadata={contractMetadata}
        />
      )}
    </NFTPublicPageLayout>
  );
}

function DesktopLayout(props: {
  nftsGrid: React.ReactNode;
  buyEmbed: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex grow gap-6 pt-6 pb-8", props.className)}>
      <div className="flex flex-1 grow flex-col">{props.nftsGrid}</div>
      {props.buyEmbed && (
        <div className="w-[400px]">
          <div className="-mt-6 sticky top-0 pt-6">{props.buyEmbed}</div>
        </div>
      )}
    </div>
  );
}

function MobileLayout(props: {
  nftsGrid: React.ReactNode;
  buyEmbed: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("pt-2 pb-10", props.className)}>
      <NFTPublicPageTabs
        nftsPage={<div className="pt-2">{props.nftsGrid}</div>}
        buyPage={
          props.buyEmbed ? (
            <div className="pt-2">{props.buyEmbed}</div>
          ) : undefined
        }
      />
    </div>
  );
}
