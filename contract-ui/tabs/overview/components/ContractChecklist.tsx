import {
  useIsAdmin,
  useIsMinter,
} from "@3rdweb-sdk/react/hooks/useContractRoles";
import {
  useBatchesToReveal,
  useClaimConditions,
  useClaimedNFTSupply,
  useNFTs,
  useTokenSupply,
} from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { detectFeatures } from "components/contract-components/utils";
import { StepsCard } from "components/dashboard/StepsCard";
import { useTabHref } from "contract-ui/utils";
import { BigNumber } from "ethers";
import { Link, Text } from "tw-components";

interface ContractChecklistProps {
  contract: SmartContract;
}

type Step = {
  title: string;
  children: React.ReactNode;
  completed: boolean;
};

export const ContractChecklist: React.FC<ContractChecklistProps> = ({
  contract,
}) => {
  const nftHref = useTabHref("nfts");
  const tokenHref = useTabHref("tokens");
  const claimConditionsHref = useTabHref("claim-conditions");

  const nfts = useNFTs(contract, { count: 1 });
  const erc721Claimed = useClaimedNFTSupply(contract);
  const erc721ClaimConditions = useClaimConditions(contract);
  const erc20Supply = useTokenSupply(contract);
  const batchesToReveal = useBatchesToReveal(contract);

  const steps: Step[] = [
    {
      title: "Contract deployed",
      children: null,
      completed: true,
    },
  ];

  const isAdmin = useIsAdmin(contract);
  const isMinter = useIsMinter(contract);

  if (!isAdmin) {
    return null;
  }

  const isLazyMintable = detectFeatures(contract, [
    "ERC721LazyMintable",
    "ERC1155LazyMintableV2",
    "ERC1155LazyMintableV1",
  ]);
  if (isLazyMintable && isMinter) {
    steps.push({
      title: "First NFT uploaded",
      children: (
        <Text size="body.sm">
          Head to the{" "}
          <Link href={nftHref} color="blue.500">
            NFTs tab
          </Link>{" "}
          to upload your NFT metadata.
        </Text>
      ),
      completed: (nfts.data?.length || 0) > 0,
    });
  }

  const erc721hasClaimConditions = detectFeatures(contract, [
    "ERC721ClaimPhasesV1",
    "ERC721ClaimPhasesV2",
    "ERC721ClaimConditionsV1",
    "ERC721ClaimConditionsV2",
    "ERC721ClaimCustom",
  ]);
  if (erc721hasClaimConditions) {
    steps.push({
      title: "Set Claim Conditions",
      children: (
        <Text size="label.sm">
          Head to the{" "}
          <Link href={claimConditionsHref} color="blue.500">
            Claim Conditions tab
          </Link>{" "}
          to set your claim conditions. Users will be able to claim your drop
          only if a claim phase is active.
        </Text>
      ),
      completed:
        (erc721ClaimConditions.data?.length || 0) > 0 ||
        BigNumber.from(erc721Claimed?.data || 0).gt(0),
    });
  }
  if (erc721hasClaimConditions) {
    steps.push({
      title: "First NFT claimed",
      children: <Text size="label.sm">No NFTs have been claimed so far.</Text>,
      completed: BigNumber.from(erc721Claimed?.data || 0).gt(0),
    });
  }

  const erc20HasClaimConditions = detectFeatures(contract, [
    "ERC20ClaimPhasesV1",
    "ERC20ClaimPhasesV2",
    "ERC20ClaimConditionsV1",
    "ERC20ClaimConditionsV2",
  ]);
  if (erc20HasClaimConditions) {
    steps.push({
      title: "First token claimed",
      children: (
        <Text size="label.sm">No tokens have been claimed so far.</Text>
      ),
      completed: BigNumber.from(erc20Supply?.data?.value || 0).gt(0),
    });
  }

  const tokenIsMintable = detectFeatures(contract, ["ERC20Mintable"]);
  if (tokenIsMintable && isMinter) {
    steps.push({
      title: "First token minted",
      children: (
        <Text size="label.sm">
          Head to the{" "}
          <Link href={tokenHref} color="blue.500">
            token tab
          </Link>{" "}
          to mint your first token.
        </Text>
      ),
      completed: BigNumber.from(erc20Supply.data?.value || 0).gt(0),
    });
  }

  const nftIsMintable = detectFeatures(contract, [
    "ERC721Mintable",
    "ERC1155Mintable",
  ]);
  if (nftIsMintable && isMinter) {
    steps.push({
      title: "First NFT minted",
      children: (
        <Text size="label.sm">
          Head to the{" "}
          <Link href={nftHref} color="blue.500">
            NFTs tab
          </Link>{" "}
          to mint your first token.
        </Text>
      ),
      completed: (nfts.data?.length || 0) > 0,
    });
  }

  const isRevealable = detectFeatures(contract, [
    "ERC721Revealable",
    "ERC1155Revealable",
  ]);
  const needsReveal = batchesToReveal.data?.length || 0 > 0;
  if (isRevealable && needsReveal) {
    steps.push({
      title: "NFTs revealed",
      children: (
        <Text size="label.sm">
          Head to the{" "}
          <Link href={nftHref} color="blue.500">
            NFTs tab
          </Link>{" "}
          to reveal your NFTs.
        </Text>
      ),
      // This is always false because if there are batches to reveal, the step doesn't show.
      completed: false,
    });
  }

  if (steps.length === 1) {
    return null;
  }

  return <StepsCard title="Contract checklist" steps={steps} />;
};
