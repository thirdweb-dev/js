import { useIsMinter } from "@3rdweb-sdk/react/hooks/useContractRoles";
import type { DropContract, NFTContract } from "@thirdweb-dev/react/evm";
import { detectFeatures } from "components/contract-components/utils";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import type { NFTDrawerTab } from "./types";

type UseNFTDrawerTabsParams = {
  contract: ThirdwebContract;
  oldContract?: NFTContract;
  tokenId: string;
};

const TransferTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/transfer-tab"),
);
const AirdropTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/airdrop-tab"),
);
const BurnTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/burn-tab"),
);
const MintSupplyTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/mint-supply-tab"),
);
const ClaimConditionTab = dynamic(() =>
  import("contract-ui/tabs/claim-conditions/components/claim-conditions").then(
    ({ ClaimConditions }) => ClaimConditions,
  ),
);
const ClaimTabERC1155 = dynamic(
  () => import("contract-ui/tabs/nfts/components/claim-tab"),
);
const UpdateMetadataTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/update-metadata-tab"),
);

export function useNFTDrawerTabs({
  contract,
  oldContract,
  tokenId,
}: UseNFTDrawerTabsParams): NFTDrawerTab[] {
  const address = useActiveAccount()?.address;

  const isERC721Query = useReadContract(ERC721Ext.isERC721, { contract });

  // Check if the contract is ERC721 or ERC1155
  const isERC721 = isERC721Query.isLoading
    ? false
    : isERC721Query.data || false;
  const isERC1155 = isERC721Query.isLoading ? false : !isERC721;

  const balanceOfQuery = useReadContract(ERC1155Ext.balanceOf, {
    contract,
    owner: address || "",
    tokenId: BigInt(tokenId || 0),
    queryOptions: { enabled: isERC1155 },
  });

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

  const hasNewClaimConditions = useMemo(
    () =>
      detectFeatures(oldContract, [
        // erc721
        "ERC721ClaimConditionsV2",
        "ERC721ClaimPhasesV2",
        // erc1155
        "ERC1155ClaimConditionsV2",
        "ERC1155ClaimPhasesV2",
      ]),
    [oldContract],
  );
  const hasMultiPhaseClaimConditions = useMemo(
    () =>
      detectFeatures(oldContract, [
        // erc721
        "ERC721ClaimPhasesV2",
        // erc1155
        "ERC1155ClaimPhasesV2",
      ]),
    [oldContract],
  );
  const contractInfo = useMemo(() => {
    return {
      hasNewClaimConditions,
      // it cannot be erc20 since were in the NFT DRAWER TABS!
      isErc20: false,
      isMultiPhase: hasMultiPhaseClaimConditions,
    };
  }, [hasNewClaimConditions, hasMultiPhaseClaimConditions]);

  return useMemo(() => {
    const isMintable = detectFeatures(oldContract, ["ERC1155Mintable"]);
    const isClaimable = detectFeatures<DropContract>(oldContract, [
      // erc1155
      "ERC1155ClaimPhasesV1",
      "ERC1155ClaimPhasesV2",
      "ERC1155ClaimConditionsV1",
      "ERC1155ClaimConditionsV2",
      "ERC1155ClaimCustom",
    ]);
    const hasClaimConditions = detectFeatures<DropContract>(oldContract, [
      // erc1155
      "ERC1155ClaimPhasesV1",
      "ERC1155ClaimPhasesV2",
      "ERC1155ClaimConditionsV1",
      "ERC1155ClaimConditionsV2",
    ]);
    const isBurnable = detectFeatures(oldContract, [
      "ERC721Burnable",
      "ERC1155Burnable",
    ]);
    const isUpdatable = detectFeatures(oldContract, [
      "ERC721UpdatableMetadata",
      "ERC1155UpdatableMetadata",
      "ERC1155LazyMintableV2",
      "ERC721LazyMintable",
    ]);

    const isDropContract = detectFeatures(oldContract, [
      "ERC721LazyMintable",
      "ERC1155LazyMintableV1",
      "ERC1155LazyMintableV2",
    ]);

    const isOwner =
      (isERC1155 && balanceOfQuery?.data) ||
      (isERC721 && nft?.owner === address);

    let tabs: NFTDrawerTab[] = [];
    if (hasClaimConditions && isERC1155) {
      tabs = tabs.concat([
        {
          title: "Claim Conditions",
          isDisabled: false,
          children: (
            <ClaimConditionTab
              contractInfo={contractInfo}
              contract={contract}
              tokenId={tokenId}
              isColumn
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
        children: <TransferTab contract={contract} tokenId={tokenId} />,
      },
    ]);

    if (isERC1155) {
      tabs = tabs.concat([
        {
          title: "Airdrop",
          isDisabled: !isOwner,
          disabledText: "You don't own any copy of this NFT",
          children: <AirdropTab contract={contract} tokenId={tokenId} />,
        },
      ]);
    }
    if (isBurnable) {
      tabs = tabs.concat([
        {
          title: "Burn",
          isDisabled: !isOwner,
          disabledText: "You don't own this NFT",
          children: <BurnTab contract={contract} tokenId={tokenId} />,
        },
      ]);
    }
    if (isMintable && isERC1155) {
      tabs = tabs.concat([
        {
          title: "Mint",
          isDisabled: false,
          disabledText: "You don't have minter permissions",
          children: <MintSupplyTab contract={contract} tokenId={tokenId} />,
        },
      ]);
    }
    if (isClaimable && isERC1155 && oldContract) {
      tabs = tabs.concat([
        {
          title: "Claim",
          isDisabled: false,
          children: <ClaimTabERC1155 contract={contract} tokenId={tokenId} />,
        },
      ]);
    }
    if (isUpdatable && nft) {
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
              isDropContract={isDropContract}
            />
          ),
        },
      ]);
    }

    return tabs;
  }, [
    oldContract,
    isERC1155,
    balanceOfQuery?.data,
    isERC721,
    nft,
    address,
    tokenId,
    isMinterRole,
    contract,
    contractInfo,
  ]);
}
