import type { ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { BatchLazyMintButton } from "./components/batch-lazy-mint-button";
import { NFTClaimButton } from "./components/claim-button";
import { NFTLazyMintButton } from "./components/lazy-mint-button";
import { NFTMintButton } from "./components/mint-button";
import { NFTRevealButton } from "./components/reveal-button";
import { NFTSharedMetadataButton } from "./components/shared-metadata-button";
import { SupplyCards } from "./components/supply-cards";
import { NFTGetAllTable } from "./components/table";

interface NftOverviewPageProps {
  contract: ThirdwebContract;
  isErc721: boolean;
  tokenId?: string;
  functionSelectors: string[];
  isLoggedIn: boolean;
}

export const ContractNFTPage: React.FC<NftOverviewPageProps> = ({
  contract,
  isErc721,
  functionSelectors,
  isLoggedIn,
}) => {
  const isERC721ClaimToSupported =
    ERC721Ext.isClaimToSupported(functionSelectors);
  const canShowSupplyCards =
    ERC721Ext.isTotalSupplySupported(functionSelectors) &&
    ERC721Ext.isNextTokenIdToMintSupported(functionSelectors);

  const isLazyMintable = isErc721
    ? ERC721Ext.isLazyMintSupported(functionSelectors)
    : ERC1155Ext.isLazyMintSupported(functionSelectors);

  const isMintToSupported = isErc721
    ? ERC721Ext.isMintToSupported(functionSelectors)
    : ERC1155Ext.isMintToSupported(functionSelectors);

  const isSetSharedMetadataSupported =
    ERC721Ext.isSetSharedMetadataSupported(functionSelectors);

  const isTokenByIndexSupported =
    ERC721Ext.isTokenByIndexSupported(functionSelectors);

  const canRenderNFTTable = (() => {
    if (isErc721) {
      return ERC721Ext.isGetNFTsSupported(functionSelectors);
    }
    // otherwise erc1155
    return ERC1155Ext.isGetNFTsSupported(functionSelectors);
  })();

  const isRevealable = ERC721Ext.isRevealSupported(functionSelectors);
  const canCreateDelayedRevealBatch =
    ERC721Ext.isCreateDelayedRevealBatchSupported(functionSelectors);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">NFTs</h2>
        <div className="grid grid-cols-2 gap-2 md:flex">
          {isRevealable && (
            <NFTRevealButton contract={contract} isLoggedIn={isLoggedIn} />
          )}
          {isERC721ClaimToSupported && (
            /**
             * This button is used for claiming NFT Drop contract (erc721) only!
             * For Edition Drop we have a dedicated ClaimTabERC1155 inside each Edition's page
             */
            <NFTClaimButton contract={contract} isLoggedIn={isLoggedIn} />
          )}
          {isMintToSupported && (
            <NFTMintButton
              contract={contract}
              isErc721={isErc721}
              isLoggedIn={isLoggedIn}
            />
          )}
          {isSetSharedMetadataSupported && (
            <NFTSharedMetadataButton
              contract={contract}
              isLoggedIn={isLoggedIn}
            />
          )}
          {isLazyMintable && (
            <NFTLazyMintButton
              contract={contract}
              isErc721={isErc721}
              isLoggedIn={isLoggedIn}
            />
          )}
          {isLazyMintable && (
            <BatchLazyMintButton
              isLoggedIn={isLoggedIn}
              canCreateDelayedRevealBatch={canCreateDelayedRevealBatch}
              isErc721={isErc721}
              contract={contract}
            />
          )}
        </div>
      </div>
      {canShowSupplyCards && <SupplyCards contract={contract} />}
      {canRenderNFTTable && (
        <NFTGetAllTable
          contract={contract}
          isErc721={isErc721}
          tokenByIndex={isTokenByIndexSupported}
        />
      )}
    </div>
  );
};
