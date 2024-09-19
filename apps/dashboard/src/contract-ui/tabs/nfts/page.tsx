import { useRouter } from "next/router";
import type { ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useContractFunctionSelectors } from "../../hooks/useContractFunctionSelectors";
import { BatchLazyMintButton } from "./components/batch-lazy-mint-button";
import { NFTClaimButton } from "./components/claim-button";
import { NFTLazyMintButton } from "./components/lazy-mint-button";
import { NFTMintButton } from "./components/mint-button";
import { NFTRevealButton } from "./components/reveal-button";
import { NFTSharedMetadataButton } from "./components/shared-metadata-button";
import { SupplyCards } from "./components/supply-cards";
import { NFTGetAllTable } from "./components/table";
import { TokenIdPage } from "./components/token-id";

interface NftOverviewPageProps {
  contract: ThirdwebContract;
  isErc721: boolean;
}

function isOnlyNumbers(str: string) {
  return /^\d+$/.test(str);
}

export const ContractNFTPage: React.FC<NftOverviewPageProps> = ({
  contract,
  isErc721,
}) => {
  const router = useRouter();
  const tokenId = router.query?.paths?.[2];
  const functionSelectorQuery = useContractFunctionSelectors(contract);

  if (tokenId && isOnlyNumbers(tokenId)) {
    return (
      <TokenIdPage contract={contract} tokenId={tokenId} isErc721={isErc721} />
    );
  }

  if (functionSelectorQuery.isLoading || !functionSelectorQuery.data) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  const isERC721ClaimToSupported = ERC721Ext.isClaimToSupported(
    functionSelectorQuery.data,
  );
  const canShowSupplyCards =
    ERC721Ext.isTotalSupplySupported(functionSelectorQuery.data) &&
    ERC721Ext.isNextTokenIdToMintSupported(functionSelectorQuery.data);

  const isLazyMintable = isErc721
    ? ERC721Ext.isLazyMintSupported(functionSelectorQuery.data)
    : ERC1155Ext.isLazyMintSupported(functionSelectorQuery.data);

  const isMintToSupported = isErc721
    ? ERC721Ext.isMintToSupported(functionSelectorQuery.data)
    : ERC1155Ext.isMintToSupported(functionSelectorQuery.data);

  const isSetSharedMetadataSupported = ERC721Ext.isSetSharedMetadataSupported(
    functionSelectorQuery.data,
  );

  const canRenderNFTTable = (() => {
    if (isErc721) {
      return ERC721Ext.isGetNFTsSupported(functionSelectorQuery.data);
    }
    // otherwise erc1155
    return ERC1155Ext.isGetNFTsSupported(functionSelectorQuery.data);
  })();

  const isRevealable = ERC721Ext.isRevealSupported(functionSelectorQuery.data);
  const canCreateDelayedRevealBatch =
    ERC721Ext.isCreateDelayedRevealBatchSupported(functionSelectorQuery.data);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Contract NFTs</h2>
        <div className="flex gap-2 flex-col md:flex-row">
          {isRevealable && <NFTRevealButton contract={contract} />}
          {isERC721ClaimToSupported && (
            /**
             * This button is used for claiming NFT Drop contract (erc721) only!
             * For Edition Drop we have a dedicated ClaimTabERC1155 inside each Edition's page
             */
            <NFTClaimButton contract={contract} />
          )}
          {isMintToSupported && (
            <NFTMintButton contract={contract} isErc721={isErc721} />
          )}
          {isSetSharedMetadataSupported && (
            <NFTSharedMetadataButton contract={contract} />
          )}
          {isLazyMintable && (
            <NFTLazyMintButton contract={contract} isErc721={isErc721} />
          )}
          {isLazyMintable && (
            <BatchLazyMintButton
              canCreateDelayedRevealBatch={canCreateDelayedRevealBatch}
              isErc721={isErc721}
              contract={contract}
            />
          )}
        </div>
      </div>
      {canShowSupplyCards && <SupplyCards contract={contract} />}
      {canRenderNFTTable && (
        <NFTGetAllTable contract={contract} isErc721={isErc721} />
      )}
    </div>
  );
};
