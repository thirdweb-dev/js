import { NFTDrawerTab } from "./types";
import {
  DropContract,
  NFTContract,
  getErcs,
  useAddress,
  useNFTBalance,
} from "@thirdweb-dev/react/evm";
import type { NFT } from "@thirdweb-dev/sdk";
import { detectFeatures } from "components/contract-components/utils";
import { BigNumber } from "ethers";
import dynamic from "next/dynamic";
import { useMemo } from "react";

type UseNFTDrawerTabsParams = [contract: NFTContract, token: NFT | null];

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

export function useNFTDrawerTabs(
  ...args: UseNFTDrawerTabsParams
): NFTDrawerTab[] {
  const [contract, token] = args;
  const tokenId = token?.metadata.id || "";
  const address = useAddress();
  const balanceOf = useNFTBalance(contract, address, token?.metadata.id);

  return useMemo(() => {
    const isERC1155 = detectFeatures(contract, ["ERC1155"]);
    const isERC721 = detectFeatures(contract, ["ERC721"]);
    const isMintable = detectFeatures(contract, ["ERC1155Mintable"]);
    const isClaimable = detectFeatures<DropContract>(contract, [
      // erc1155
      "ERC1155ClaimPhasesV1",
      "ERC1155ClaimPhasesV2",
      "ERC1155ClaimConditionsV1",
      "ERC1155ClaimConditionsV2",
      "ERC1155ClaimCustom",
    ]);
    const hasClaimConditions = detectFeatures<DropContract>(contract, [
      // erc1155
      "ERC1155ClaimPhasesV1",
      "ERC1155ClaimPhasesV2",
      "ERC1155ClaimConditionsV1",
      "ERC1155ClaimConditionsV2",
    ]);
    const isBurnable = detectFeatures(contract, [
      "ERC721Burnable",
      "ERC1155Burnable",
    ]);
    const isOwner =
      (isERC1155 && BigNumber.from(balanceOf?.data || 0).gt(0)) ||
      (isERC721 && token?.owner === address);

    const { erc1155 } = getErcs(contract);
    let tabs: NFTDrawerTab[] = [];
    if (hasClaimConditions && isERC1155) {
      tabs = tabs.concat([
        {
          title: "Claim Conditions",
          isDisabled: false,
          children: (
            <ClaimConditionTab contract={contract} tokenId={tokenId} isColumn />
          ),
        },
      ]);
    }
    tabs = tabs.concat([
      {
        title: "Transfer",
        isDisabled: !isOwner,
        disabledText: erc1155
          ? "You don't own any copy of this NFT"
          : "You don't own this NFT",
        children: <TransferTab contract={contract} tokenId={tokenId} />,
      },
    ]);
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
          children: <BurnTab contract={contract} tokenId={tokenId} />,
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
          children: <ClaimTab contract={contract} tokenId={tokenId} />,
        },
      ]);
    }

    return tabs;
  }, [address, balanceOf?.data, contract, token?.owner, tokenId]);
}
