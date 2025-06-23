import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { checksumAddress } from "thirdweb/utils";
import { useContractFunctionSelectors } from "@/hooks/contract-ui/useContractFunctionSelectors";
import { useIsMinter } from "@/hooks/useContractRoles";
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
      includeOwner: true,
      queryOptions: { enabled: isERC721 || isERC1155 },
      tokenId: BigInt(tokenId || 0),
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
          children: (
            <ClaimConditionTab
              contract={contract}
              isColumn
              isERC20={false}
              isLoggedIn={isLoggedIn}
              isMultiphase={isERC1155Multiphase}
              tokenId={tokenId}
            />
          ),
          isDisabled: false,
          title: "Claim Conditions",
        },
      ]);
    }

    tabs = tabs.concat([
      {
        children: (
          <TransferTab
            contract={contract}
            isLoggedIn={isLoggedIn}
            tokenId={tokenId}
          />
        ),
        disabledText: isERC1155
          ? "You don't own any copy of this NFT"
          : "You don't own this NFT",
        isDisabled: !isOwner,
        title: "Transfer",
      },
    ]);

    if (isERC1155) {
      tabs = tabs.concat([
        {
          children: (
            <AirdropTab
              contract={contract}
              isLoggedIn={isLoggedIn}
              tokenId={tokenId}
            />
          ),
          disabledText: "You don't own any copy of this NFT",
          isDisabled: !isOwner,
          title: "Airdrop",
        },
      ]);
    }
    if (isBurnable) {
      tabs = tabs.concat([
        {
          children: (
            <BurnTab
              contract={contract}
              isLoggedIn={isLoggedIn}
              tokenId={tokenId}
            />
          ),
          disabledText: "You don't own this NFT",
          isDisabled: !isOwner,
          title: "Burn",
        },
      ]);
    }
    if (ERC1155Ext.isMintAdditionalSupplyToSupported(functionSelectors)) {
      tabs = tabs.concat([
        {
          children: (
            <MintSupplyTab
              contract={contract}
              isLoggedIn={isLoggedIn}
              tokenId={tokenId}
            />
          ),
          disabledText: "You don't have minter permissions",
          isDisabled: false,
          title: "Mint",
        },
      ]);
    }
    if (hasERC1155ClaimConditions) {
      tabs = tabs.concat([
        {
          children: (
            <ClaimTabERC1155
              contract={contract}
              isLoggedIn={isLoggedIn}
              tokenId={tokenId}
            />
          ),
          isDisabled: false,
          title: "Claim",
        },
      ]);
    }
    if ((supportsUpdateTokenURI || supportsUpdateMetadata) && nft) {
      tabs = tabs.concat([
        {
          children: (
            <UpdateMetadataTab
              contract={contract}
              isLoggedIn={isLoggedIn}
              nft={nft}
              useUpdateMetadata={supportsUpdateMetadata}
            />
          ),
          disabledText:
            "You don't have minter permissions to be able to update metadata",
          isDisabled: !isMinterRole,
          title: "Update Metadata",
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
