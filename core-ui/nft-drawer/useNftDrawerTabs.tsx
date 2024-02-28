import { NFTDrawerTab } from "./types";
import {
  DropContract,
  NFTContract,
  getErcs,
  useAddress,
} from "@thirdweb-dev/react/evm";
import { detectFeatures } from "components/contract-components/utils";
import { BigNumber } from "ethers";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc1155";
import { getNFT } from "thirdweb/extensions/erc721";
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

export function useNFTDrawerTabs({
  contract,
  oldContract,
  tokenId,
}: UseNFTDrawerTabsParams): NFTDrawerTab[] {
  const address = useAddress();

  const balanceOfQuery = useReadContract(balanceOf, {
    contract,
    address: address || "",
    tokenId: BigInt(tokenId || 0),
  });

  const { data: nft } = useReadContract(getNFT, {
    contract,
    tokenId: BigInt(tokenId || 0),
    includeOwner: true,
  });

  return useMemo(() => {
    const isERC1155 = detectFeatures(oldContract, ["ERC1155"]);
    const isERC721 = detectFeatures(oldContract, ["ERC721"]);
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

    return tabs;
  }, [oldContract, balanceOfQuery?.data, nft?.owner, address, tokenId]);
}
