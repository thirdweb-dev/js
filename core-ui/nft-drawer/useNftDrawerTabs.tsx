import { NFTDrawerTab } from "./types";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  DropContract,
  NFTContract,
  getErcs,
  useAddress,
  useNFTBalance,
} from "@thirdweb-dev/react/evm";
import type { NFT } from "@thirdweb-dev/sdk";
import type { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import { detectFeatures } from "components/contract-components/utils";
import { BigNumber } from "ethers";
import dynamic from "next/dynamic";
import { useMemo } from "react";

type UseNFTDrawerTabsParams =
  | [ecosystem: "evm", contract: NFTContract, token: NFT | null]
  | [ecosystem: "solana", program: NFTCollection | NFTDrop, token: NFT | null];

const SOLTransferTab = dynamic(
  () => import("program-ui/nft/drawer-tabs/transfer"),
);
const SOLBurnTab = dynamic(() => import("program-ui/nft/drawer-tabs/burn"));
const SOLMintSupplyTab = dynamic(
  () => import("program-ui/nft/drawer-tabs/mint-supply"),
);

const EVMTransferTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/transfer-tab"),
);
const EVMAirdropTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/airdrop-tab"),
);
const EVMBurnTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/burn-tab"),
);

const EVMMintSupplyTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/mint-supply-tab"),
);
const EVMClaimConditionTab = dynamic(
  () => import("contract-ui/tabs/claim-conditions/components/claim-conditions"),
);
const EVMClaimTab = dynamic(
  () => import("contract-ui/tabs/nfts/components/claim-tab"),
);

export function useNFTDrawerTabs(
  ...args: UseNFTDrawerTabsParams
): NFTDrawerTab[] {
  const [ecosystem, contractOrProgram, token] = args;

  const tokenId = token?.metadata.id || "";

  if (ecosystem === "solana") {
    // solana land
    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const solAddress = useWallet().publicKey?.toBase58();
    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
      const isOwner = token?.owner === solAddress;
      let tabs: NFTDrawerTab[] = [
        {
          title: "Transfer",
          isDisabled: !isOwner,
          children: (
            <SOLTransferTab program={contractOrProgram} tokenId={tokenId} />
          ),
        },
        {
          title: "Burn",
          isDisabled: !isOwner,
          children: (
            <SOLBurnTab program={contractOrProgram} tokenId={tokenId} />
          ),
        },
      ];

      if (contractOrProgram.accountType === "nft-collection") {
        tabs = tabs.concat([
          {
            title: "Mint",
            // TODO: Disable if the user is not the authority
            isDisabled: false,
            children: (
              <SOLMintSupplyTab
                program={contractOrProgram as NFTCollection}
                tokenId={tokenId}
              />
            ),
          },
        ]);
      }
      return tabs;
    }, [contractOrProgram, solAddress, token, tokenId]);
  }

  if (ecosystem === "evm") {
    // evm land

    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const address = useAddress();
    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const balanceOf = useNFTBalance(
      contractOrProgram,
      address,
      token?.metadata.id,
    );

    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
      const isERC1155 = detectFeatures(contractOrProgram, ["ERC1155"]);
      const isERC721 = detectFeatures(contractOrProgram, ["ERC721"]);
      const isMintable = detectFeatures(contractOrProgram, ["ERC1155Mintable"]);
      const isClaimable = detectFeatures<DropContract>(contractOrProgram, [
        // erc1155
        "ERC1155ClaimPhasesV1",
        "ERC1155ClaimPhasesV2",
        "ERC1155ClaimConditionsV1",
        "ERC1155ClaimConditionsV2",
        "ERC1155ClaimCustom",
      ]);
      const hasClaimConditions = detectFeatures<DropContract>(
        contractOrProgram,
        [
          // erc1155
          "ERC1155ClaimPhasesV1",
          "ERC1155ClaimPhasesV2",
          "ERC1155ClaimConditionsV1",
          "ERC1155ClaimConditionsV2",
        ],
      );
      const isBurnable = detectFeatures(contractOrProgram, [
        "ERC721Burnable",
        "ERC1155Burnable",
      ]);
      const isOwner =
        (isERC1155 && BigNumber.from(balanceOf?.data || 0).gt(0)) ||
        (isERC721 && token?.owner === address);
      const { erc1155 } = getErcs(contractOrProgram);
      let tabs: NFTDrawerTab[] = [
        {
          title: "Transfer",
          isDisabled: !isOwner,
          children: (
            <EVMTransferTab contract={contractOrProgram} tokenId={tokenId} />
          ),
        },
      ];
      if (erc1155) {
        tabs = tabs.concat([
          {
            title: "Airdrop",
            isDisabled: !isOwner,
            children: <EVMAirdropTab contract={erc1155} tokenId={tokenId} />,
          },
        ]);
      }
      if (isBurnable) {
        tabs = tabs.concat([
          {
            title: "Burn",
            isDisabled: !isOwner,
            children: (
              <EVMBurnTab contract={contractOrProgram} tokenId={tokenId} />
            ),
          },
        ]);
      }
      if (isMintable && erc1155) {
        tabs = tabs.concat([
          {
            title: "Mint",
            isDisabled: false,
            children: <EVMMintSupplyTab contract={erc1155} tokenId={tokenId} />,
          },
        ]);
      }
      if (hasClaimConditions && isERC1155) {
        tabs = tabs.concat([
          {
            title: "Claim Conditions",
            isDisabled: false,
            children: (
              <EVMClaimConditionTab
                contract={contractOrProgram}
                tokenId={tokenId}
                isColumn
              />
            ),
          },
        ]);
      }
      if (isClaimable && isERC1155) {
        tabs = tabs.concat([
          {
            title: "Claim",
            isDisabled: false,
            children: (
              <EVMClaimTab contract={contractOrProgram} tokenId={tokenId} />
            ),
          },
        ]);
      }

      return tabs;
    }, [address, balanceOf?.data, contractOrProgram, token?.owner, tokenId]);
  }

  return [];
}
