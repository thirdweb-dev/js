import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isTokenByIndexSupported } from "thirdweb/extensions/erc721";
import { ResponsiveLayout } from "@/components/Responsive";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
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
        contract: props.serverContract,
        type: props.type,
      }),
    ]);

  const nftDropClaimParams =
    props.type === "erc721"
      ? await getNFTDropClaimParams({
          chainMetadata: props.chainMetadata,
          functionSelectors,
          serverContract: props.serverContract,
          totalNFTCount,
        })
      : undefined;

  const _isTokenByIndexSupported =
    props.type === "erc721" && isTokenByIndexSupported(functionSelectors);

  const buyNFTDropCard = nftDropClaimParams ? (
    <BuyNFTDropCardServer
      chainMetadata={props.chainMetadata}
      clientContract={props.clientContract}
      erc721ActiveClaimCondition={nftDropClaimParams.erc721ActiveClaimCondition}
      erc721ClaimConditionCurrencyMeta={
        nftDropClaimParams.erc721ClaimConditionCurrencyMeta
      }
      erc721NextTokenIdToClaim={nftDropClaimParams.erc721NextTokenIdToClaim}
      erc721TotalUnclaimedSupply={nftDropClaimParams.erc721TotalUnclaimedSupply}
      functionSelectors={functionSelectors}
      serverContract={props.serverContract}
      totalNFTCount={totalNFTCount}
    />
  ) : null;

  const nftsGrid = (
    <NFTsGrid
      chainMetadata={props.chainMetadata}
      clientContract={props.clientContract}
      collectionMetadata={contractMetadata}
      gridClassName={
        buyNFTDropCard
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : undefined
      }
      isTokenByIndexSupported={_isTokenByIndexSupported}
      totalNFTCount={totalNFTCount}
      type={props.type}
    />
  );

  const nftGridSkeleton = (
    <NFTGridSkeleton
      chainMetadata={props.chainMetadata}
      clientContract={props.clientContract}
      gridClassName={
        buyNFTDropCard
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : undefined
      }
      type={props.type}
    />
  );

  const buyEmbedSkeleton = buyNFTDropCard ? (
    <Skeleton className="h-[620px] border" />
  ) : null;

  return (
    <NFTPublicPageLayout
      chainMetadata={props.chainMetadata}
      clientContract={props.clientContract}
      contractMetadata={contractMetadata}
    >
      <ResponsiveLayout
        desktop={
          <DesktopLayout buyEmbed={buyNFTDropCard} nftsGrid={nftsGrid} />
        }
        fallback={
          <div className="flex grow flex-col">
            <DesktopLayout
              buyEmbed={buyEmbedSkeleton}
              className="max-sm:hidden"
              nftsGrid={nftGridSkeleton}
            />

            <MobileLayout
              buyEmbed={buyEmbedSkeleton}
              className="sm:hidden"
              nftsGrid={nftGridSkeleton}
            />
          </div>
        }
        mobile={<MobileLayout buyEmbed={buyNFTDropCard} nftsGrid={nftsGrid} />}
      />
      {props.tokenId && (
        <PageLoadTokenViewerSheet
          chainMetadata={props.chainMetadata}
          clientContract={props.clientContract}
          collectionMetadata={contractMetadata}
          tokenByIndexSupported={_isTokenByIndexSupported}
          tokenId={BigInt(props.tokenId)}
          type={props.type}
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
        buyPage={
          props.buyEmbed ? (
            <div className="pt-2">{props.buyEmbed}</div>
          ) : undefined
        }
        nftsPage={<div className="pt-2">{props.nftsGrid}</div>}
      />
    </div>
  );
}
