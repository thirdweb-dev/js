import {
  useIsAdmin,
  useIsMinter,
} from "@3rdweb-sdk/react/hooks/useContractRoles";
import { useBatchesToReveal, useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { StepsCard } from "components/dashboard/StepsCard";
import { useTabHref } from "contract-ui/utils";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import * as ERC4337Ext from "thirdweb/extensions/erc4337";
import { getAccounts } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import { Link, Text } from "tw-components";
import { useContractFunctionSelectors } from "../../../hooks/useContractFunctionSelectors";

interface ContractChecklistProps {
  contract: ThirdwebContract;
  isErc721: boolean;
  isErc1155: boolean;
  isErc20: boolean;
}

type Step = {
  title: string;
  children: React.ReactNode;
  completed: boolean;
};

export const ContractChecklist: React.FC<ContractChecklistProps> = ({
  contract,
  isErc1155,
  isErc20,
  isErc721,
}) => {
  const functionSelectorQuery = useContractFunctionSelectors(contract);
  const contractQuery = useContract(contract.address);
  const nftHref = useTabHref("nfts");
  const tokenHref = useTabHref("tokens");
  const accountsHref = useTabHref("accounts");
  const claimConditionsHref = useTabHref("claim-conditions");

  const erc721Claimed = useReadContract(ERC721Ext.getTotalClaimedSupply, {
    contract: contract,
    queryOptions: { enabled: isErc721 },
  });
  const erc20Supply = useReadContract(ERC20Ext.totalSupply, {
    contract,
    queryOptions: { enabled: isErc20 },
  });
  const accounts = useReadContract(getAccounts, {
    contract,
    start: 0n,
    end: 1n,
  });
  const nftsQuery = useReadContract(
    isErc721 ? ERC721Ext.getNFTs : ERC721Ext.getNFTs,
    {
      contract,
      start: 0,
      count: 1,
      queryOptions: { enabled: isErc721 || isErc1155 },
    },
  );

  const sharedMetadataQuery = useReadContract(ERC721Ext.sharedMetadata, {
    contract,
    queryOptions: { enabled: isErc721 },
  });

  const claimConditions = useReadContract(
    isErc721 ? ERC721Ext.getClaimConditions : ERC1155Ext.getClaimConditions,
    {
      contract,
      tokenId: 0n,
      queryOptions: { enabled: isErc721 || isErc1155 },
    },
  );

  // need to replace!
  const batchesToReveal = useBatchesToReveal(contractQuery.contract);

  const steps: Step[] = [
    {
      title: "Contract deployed",
      children: null,
      completed: true,
    },
  ];

  const isAdmin = useIsAdmin(contract);
  const isMinter = useIsMinter(contract);

  const isLazyMintable = useMemo(() => {
    if (isErc721) {
      return ERC721Ext.isLazyMintSupported(functionSelectorQuery.data);
    }
    if (isErc1155) {
      return ERC1155Ext.isLazyMintSupported(functionSelectorQuery.data);
    }
    return false;
  }, [functionSelectorQuery.data, isErc721, isErc1155]);

  const hasERC721ClaimConditions = useMemo(() => {
    return [
      // reads
      ERC721Ext.isGetClaimConditionByIdSupported(functionSelectorQuery.data),
      ERC721Ext.isGetActiveClaimConditionIdSupported(
        functionSelectorQuery.data,
      ),
      ERC721Ext.isGetClaimConditionsSupported(functionSelectorQuery.data),
      ERC721Ext.isGetActiveClaimConditionSupported(functionSelectorQuery.data),
      // writes
      ERC721Ext.isSetClaimConditionsSupported(functionSelectorQuery.data),
      ERC721Ext.isResetClaimEligibilitySupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  const hasERC20ClaimConditions = useMemo(() => {
    return [
      // reads
      ERC20Ext.isGetClaimConditionByIdSupported(functionSelectorQuery.data),
      ERC20Ext.isGetActiveClaimConditionIdSupported(functionSelectorQuery.data),
      ERC20Ext.isGetClaimConditionsSupported(functionSelectorQuery.data),
      ERC20Ext.isGetActiveClaimConditionSupported(functionSelectorQuery.data),
      // writes
      ERC20Ext.isSetClaimConditionsSupported(functionSelectorQuery.data),
      ERC20Ext.isResetClaimEligibilitySupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  const accountFactory = useMemo(() => {
    return [
      ERC4337Ext.isGetAllAccountsSupported(functionSelectorQuery.data),
      ERC4337Ext.isGetAccountsSupported(functionSelectorQuery.data),
      ERC4337Ext.isTotalAccountsSupported(functionSelectorQuery.data),
      ERC4337Ext.isGetAccountsOfSignerSupported(functionSelectorQuery.data),
      ERC4337Ext.isPredictAccountAddressSupported(functionSelectorQuery.data),
    ].every(Boolean);
  }, [functionSelectorQuery.data]);

  if (!isAdmin) {
    return null;
  }

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
      // can be either 721 or 1155
      completed: (nftsQuery.data?.length || 0) > 0,
    });
  }

  if (ERC721Ext.isSharedMetadataSupported(functionSelectorQuery.data)) {
    steps.push({
      title: "Set NFT Metadata",
      children: (
        <Text size="label.sm">
          Head to the{" "}
          <Link href={nftHref} color="blue.500">
            NFTs tab
          </Link>{" "}
          to set your NFT metadata.
        </Text>
      ),
      completed: !!sharedMetadataQuery?.data,
    });
  }

  if (hasERC721ClaimConditions || hasERC20ClaimConditions) {
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
        (claimConditions.data?.length || 0) > 0 ||
        (erc721Claimed.data || 0n) > 0n ||
        (erc20Supply.data || 0n) > 0n,
    });
  }
  if (hasERC721ClaimConditions) {
    steps.push({
      title: "First NFT claimed",
      children: <Text size="label.sm">No NFTs have been claimed so far.</Text>,
      completed: (erc721Claimed.data || 0n) > 0n,
    });
  }

  if (hasERC20ClaimConditions) {
    steps.push({
      title: "First token claimed",
      children: (
        <Text size="label.sm">No tokens have been claimed so far.</Text>
      ),
      completed: (erc20Supply.data || 0n) > 0n,
    });
  }

  if (
    isErc20 &&
    ERC20Ext.isMintToSupported(functionSelectorQuery.data) &&
    isMinter
  ) {
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
      completed: (erc20Supply.data || 0n) > 0n,
    });
  }

  const nftIsMintable = (() => {
    if (isErc721) {
      return ERC721Ext.isMintToSupported(functionSelectorQuery.data);
    }
    if (isErc1155) {
      return ERC1155Ext.isMintToSupported(functionSelectorQuery.data);
    }
    return false;
  })();
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
      // can be either 721 or 1155
      completed: (nftsQuery.data?.length || 0) > 0,
    });
  }

  if (accountFactory) {
    steps.push({
      title: "First account created",
      children: (
        <Text size="label.sm">
          Head to the{" "}
          <Link href={accountsHref} color="blue.500">
            Accounts tab
          </Link>{" "}
          to create your first account.
        </Text>
      ),
      completed: (accounts.data?.length || 0) > 0,
    });
  }

  const isRevealable = detectFeatures(contractQuery.contract, [
    "ERC721Revealable",
    "ERC1155Revealable",
  ]);
  const needsReveal = batchesToReveal.data?.length;
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

  return <StepsCard title="Contract checklist" steps={steps} delay={1000} />;
};
