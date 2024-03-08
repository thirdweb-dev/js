import { useIsMinter } from "@3rdweb-sdk/react/hooks/useContractRoles";
import { NFTDrawerTab } from "./types";
import {
  DropContract,
  NFTContract,
  SmartContract,
  getErcs,
  useAddress,
} from "@thirdweb-dev/react/evm";
import { detectFeatures } from "components/contract-components/utils";
import { BigNumber } from "ethers";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc1155";
import { getNFT as getErc721NFT } from "thirdweb/extensions/erc721";
import { getNFT as getErc1155NFT } from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";

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
const ClaimConditionTab = dynamic(
  () => import("contract-ui/tabs/claim-conditions/components/claim-conditions"),
);
const ClaimTab = dynamic(
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
  const address = useAddress();

  const balanceOfQuery = useReadContract(balanceOf, {
    contract,
    owner: address || "",
    id: BigInt(tokenId || 0),
  });

  const isERC1155 = detectFeatures(oldContract, ["ERC1155"]);
  const isERC721 = detectFeatures(oldContract, ["ERC721"]);

  const { data: nft } = useReadContract(
    isERC721 ? getErc721NFT : getErc1155NFT,
    {
      contract,
      tokenId: BigInt(tokenId || 0),
      includeOwner: true,
    },
  );

  const isMinterRole = useIsMinter(oldContract);

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

    const isOwner =
      (isERC1155 && BigNumber.from(balanceOfQuery?.data || 0).gt(0)) ||
      (isERC721 && nft?.owner === address);

    const { erc1155 } = getErcs(oldContract);
    let tabs: NFTDrawerTab[] = [];
    if (hasClaimConditions && isERC1155) {
      tabs = tabs.concat([
        {
          title: "Claim Conditions",
          isDisabled: false,
          children: (
            <ClaimConditionTab
              contract={oldContract}
              tokenId={tokenId}
              isColumn
            />
          ),
        },
      ]);
    }
    if (oldContract) {
      tabs = tabs.concat([
        {
          title: "Transfer",
          isDisabled: !isOwner,
          disabledText: erc1155
            ? "You don't own any copy of this NFT"
            : "You don't own this NFT",
          children: <TransferTab contract={oldContract} tokenId={tokenId} />,
        },
      ]);
    }
    if (erc1155) {
      tabs = tabs.concat([
        {
          title: "Airdrop",
          isDisabled: !isOwner,
          disabledText: "You don't own any copy of this NFT",
          children: <AirdropTab contract={erc1155} tokenId={tokenId} />,
        },
      ]);
    }
    if (isBurnable) {
      tabs = tabs.concat([
        {
          title: "Burn",
          isDisabled: !isOwner,
          disabledText: "You don't own this NFT",
          children: <BurnTab contract={oldContract} tokenId={tokenId} />,
        },
      ]);
    }
    if (isMintable && erc1155) {
      tabs = tabs.concat([
        {
          title: "Mint",
          isDisabled: false,
          disabledText: "You don't have minter permissions",
          children: <MintSupplyTab contract={erc1155} tokenId={tokenId} />,
        },
      ]);
    }
    if (isClaimable && isERC1155) {
      tabs = tabs.concat([
        {
          title: "Claim",
          isDisabled: false,
          children: <ClaimTab contract={oldContract} tokenId={tokenId} />,
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
              contract={oldContract as SmartContract}
              nft={nft}
            />
          ),
        },
      ]);
    }

    return tabs;
  }, [oldContract, balanceOfQuery?.data, nft?.owner, address, tokenId]);
}
