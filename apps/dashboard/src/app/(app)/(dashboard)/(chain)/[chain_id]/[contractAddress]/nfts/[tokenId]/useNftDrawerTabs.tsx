import { useIsMinter } from "@3rdweb-sdk/react/hooks/useContractRoles";
import { useContractFunctionSelectors } from "contract-ui/hooks/useContractFunctionSelectors";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { checksumAddress } from "thirdweb/utils";
import type { NFTDrawerTab } from "./types";

type UseNFTDrawerTabsParams = {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
  accountAddress: string | undefined;
};

const TransferTab = dynamic(() => import("./components/transfer-tab"));
const AirdropTab = dynamic(() => import("./components/airdrop-tab"));
const BurnTab = dynamic(() => import("./components/burn-tab"));
const MintSupplyTab = dynamic(() => import("./components/mint-supply-tab"));
const ClaimConditionTab = dynamic(() =>
  import("../../_components/claim-conditions/claim-conditions").then(
    ({ ClaimConditions }) => ClaimConditions,
  ),
);
const ClaimTabERC1155 = dynamic(() => import("./components/claim-tab"));
const UpdateMetadataTab = dynamic(
  () => import("./components/update-metadata-tab"),
);

export function useNFTDrawerTabs({
  contract,
  tokenId,
  isLoggedIn,
  accountAddress,
}: UseNFTDrawerTabsParams): NFTDrawerTab[] {
  const functionSelectorQuery = useContractFunctionSelectors(contract);
  const functionSelectors = functionSelectorQuery.data || [];

  const isERC721Query = useReadContract(ERC721Ext.isERC721, { contract });

  // Check if the contract is ERC721 or ERC1155
  const isERC721 = isERC721Query.isPending
    ? false
    : isERC721Query.data || false;
  const isERC1155 = isERC721Query.isPending ? false : !isERC721;

  const { data: nft } = useReadContract(
    isERC721 ? ERC721Ext.getNFT : ERC1155Ext.getNFT,
    {
      contract,
      tokenId: BigInt(tokenId || 0),
      includeOwner: true,
      queryOptions: { enabled: isERC721 || isERC1155 },
    },
  );
  const isMinterRole = useIsMinter(contract);

  return useMemo(() => {
    const hasERC1155ClaimConditions = (() => {
      return [
        // reads
        ERC1155Ext.isGetClaimConditionsSupported(functionSelectors),
        ERC1155Ext.isGetActiveClaimConditionSupported(functionSelectors),
        // writes
        ERC1155Ext.isSetClaimConditionsSupported(functionSelectors),
        ERC1155Ext.isResetClaimEligibilitySupported(functionSelectors),
      ].every(Boolean);
    })();

    const isERC1155Multiphase = (() => {
      return ERC1155Ext.isGetClaimConditionByIdSupported(functionSelectors);
    })();

    const isBurnable = (() => {
      if (isERC721) {
        return ERC721Ext.isBurnSupported(functionSelectors);
      }
      if (isERC1155) {
        return ERC1155Ext.isBurnSupported(functionSelectors);
      }
      return false;
    })();

    const supportsUpdateMetadata = (() => {
      if (isERC721) {
        return ERC721Ext.isUpdateMetadataSupported(functionSelectors);
      }
      if (isERC1155) {
        return ERC1155Ext.isUpdateMetadataSupported(functionSelectors);
      }
      return false;
    })();

    const supportsUpdateTokenURI = (() => {
      if (isERC721) {
        return ERC721Ext.isUpdateTokenURISupported(functionSelectors);
      }
      if (isERC1155) {
        return ERC1155Ext.isUpdateTokenURISupported(functionSelectors);
      }
      return false;
    })();

    const isOwner = (() => {
      if (isERC1155) {
        return true;
      }
      if (isERC721) {
        return (
          accountAddress &&
          nft?.owner &&
          checksumAddress(nft.owner) === checksumAddress(accountAddress)
        );
      }
      return false;
    })();

    let tabs: NFTDrawerTab[] = [];
    if (hasERC1155ClaimConditions) {
      tabs = tabs.concat([
        {
          title: "Claim Conditions",
          isDisabled: false,
          children: (
            <ClaimConditionTab
              isERC20={false}
              contract={contract}
              tokenId={tokenId}
              isColumn
              isLoggedIn={isLoggedIn}
              isMultiphase={isERC1155Multiphase}
            />
          ),
        },
      ]);
    }

    tabs = tabs.concat([
      {
        title: "Transfer",
        isDisabled: !isOwner,
        disabledText: isERC1155
          ? "You don't own any copy of this NFT"
          : "You don't own this NFT",
        children: (
          <TransferTab
            contract={contract}
            tokenId={tokenId}
            isLoggedIn={isLoggedIn}
          />
        ),
      },
    ]);

    if (isERC1155) {
      tabs = tabs.concat([
        {
          title: "Airdrop",
          isDisabled: !isOwner,
          disabledText: "You don't own any copy of this NFT",
          children: (
            <AirdropTab
              contract={contract}
              tokenId={tokenId}
              isLoggedIn={isLoggedIn}
            />
          ),
        },
      ]);
    }
    if (isBurnable) {
      tabs = tabs.concat([
        {
          title: "Burn",
          isDisabled: !isOwner,
          disabledText: "You don't own this NFT",
          children: (
            <BurnTab
              contract={contract}
              tokenId={tokenId}
              isLoggedIn={isLoggedIn}
            />
          ),
        },
      ]);
    }
    if (ERC1155Ext.isMintAdditionalSupplyToSupported(functionSelectors)) {
      tabs = tabs.concat([
        {
          title: "Mint",
          isDisabled: false,
          disabledText: "You don't have minter permissions",
          children: (
            <MintSupplyTab
              contract={contract}
              tokenId={tokenId}
              isLoggedIn={isLoggedIn}
            />
          ),
        },
      ]);
    }
    if (hasERC1155ClaimConditions) {
      tabs = tabs.concat([
        {
          title: "Claim",
          isDisabled: false,
          children: (
            <ClaimTabERC1155
              contract={contract}
              tokenId={tokenId}
              isLoggedIn={isLoggedIn}
            />
          ),
        },
      ]);
    }
    if ((supportsUpdateTokenURI || supportsUpdateMetadata) && nft) {
      tabs = tabs.concat([
        {
          title: "Update Metadata",
          isDisabled: !isMinterRole,
          disabledText:
            "You don't have minter permissions to be able to update metadata",
          children: (
            <UpdateMetadataTab
              contract={contract}
              nft={nft}
              useUpdateMetadata={supportsUpdateMetadata}
              isLoggedIn={isLoggedIn}
            />
          ),
        },
      ]);
    }

    return tabs;
  }, [
    isERC1155,
    isERC721,
    nft,
    accountAddress,
    tokenId,
    isMinterRole,
    contract,
    functionSelectors,
    isLoggedIn,
  ]);
}
