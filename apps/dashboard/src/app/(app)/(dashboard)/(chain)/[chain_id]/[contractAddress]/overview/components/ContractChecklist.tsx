"use client";

import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { useIsMinter } from "@3rdweb-sdk/react/hooks/useContractRoles";
import { StepsCard } from "components/dashboard/StepsCard";
import Link from "next/link";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import * as ERC4337Ext from "thirdweb/extensions/erc4337";
import { getAccounts } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

interface ContractChecklistProps {
  contract: ThirdwebContract;
  isErc721: boolean;
  isErc1155: boolean;
  isErc20: boolean;
  chainSlug: string;
  functionSelectors: string[];
  projectMeta: ProjectMeta | undefined;
}

type Step = {
  title: string;
  children: React.ReactNode;
  completed: boolean;
};

export const ContractChecklist: React.FC<ContractChecklistProps> = (props) => {
  return (
    // if no permissions, simply return null (do not fail open)
    <AdminOnly contract={props.contract} failOpen={false}>
      <Inner {...props} />
    </AdminOnly>
  );
};

function Inner({
  contract,
  isErc1155,
  isErc20,
  isErc721,
  functionSelectors,
  chainSlug,
  projectMeta,
}: ContractChecklistProps & {
  functionSelectors: string[];
}) {
  const contractLayout = buildContractPagePath({
    projectMeta,
    chainIdOrSlug: chainSlug,
    contractAddress: contract.address,
  });

  const nftHref = `${contractLayout}/nfts`;
  const tokenHref = `${contractLayout}/tokens`;
  const accountsHref = `${contractLayout}/accounts`;
  const claimConditionsHref = `${contractLayout}/claim-conditions`;

  const erc721Claimed = useReadContract(ERC721Ext.getTotalClaimedSupply, {
    contract: contract,
    queryOptions: { enabled: isErc721 },
  });

  const erc20Supply = useReadContract(ERC20Ext.totalSupply, {
    contract,
    queryOptions: { enabled: isErc20 },
  });

  // account factory
  const accountFactory = useMemo(() => {
    return [
      ERC4337Ext.isGetAllAccountsSupported(functionSelectors),
      ERC4337Ext.isGetAccountsSupported(functionSelectors),
      ERC4337Ext.isTotalAccountsSupported(functionSelectors),
      ERC4337Ext.isGetAccountsOfSignerSupported(functionSelectors),
      ERC4337Ext.isPredictAccountAddressSupported(functionSelectors),
    ].every(Boolean);
  }, [functionSelectors]);
  const accounts = useReadContract(getAccounts, {
    contract,
    start: 0n,
    end: 1n,
  });
  // end account factory

  const nftsQuery = useReadContract(
    isErc721 ? ERC721Ext.getNFTs : ERC1155Ext.getNFTs,
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

  // claim conditions
  const hasERC721ClaimConditions = useMemo(() => {
    return [
      // reads
      ERC721Ext.isGetClaimConditionByIdSupported(functionSelectors),
      ERC721Ext.isGetActiveClaimConditionIdSupported(functionSelectors),
      ERC721Ext.isGetClaimConditionsSupported(functionSelectors),
      ERC721Ext.isGetActiveClaimConditionSupported(functionSelectors),
      // writes
      ERC721Ext.isSetClaimConditionsSupported(functionSelectors),
      ERC721Ext.isResetClaimEligibilitySupported(functionSelectors),
      isErc721,
    ].every(Boolean);
  }, [functionSelectors, isErc721]);

  const hasERC20ClaimConditions = useMemo(() => {
    return [
      // reads
      ERC20Ext.isGetClaimConditionByIdSupported(functionSelectors),
      ERC20Ext.isGetActiveClaimConditionIdSupported(functionSelectors),
      ERC20Ext.isGetClaimConditionsSupported(functionSelectors),
      ERC20Ext.isGetActiveClaimConditionSupported(functionSelectors),
      // writes
      ERC20Ext.isSetClaimConditionsSupported(functionSelectors),
      ERC20Ext.isResetClaimEligibilitySupported(functionSelectors),
      isErc20,
    ].every(Boolean);
  }, [functionSelectors, isErc20]);

  const claimConditions = useReadContract(
    isErc721 ? ERC721Ext.getClaimConditions : ERC20Ext.getClaimConditions,
    {
      contract,
      queryOptions: {
        enabled: hasERC721ClaimConditions || hasERC20ClaimConditions,
      },
    },
  );
  // end claim conditions

  const batchesToReveal = useReadContract(ERC721Ext.getBatchesToReveal, {
    contract,
    queryOptions: {
      enabled: ERC721Ext.isGetBatchesToRevealSupported(functionSelectors),
    },
  });

  const isMinter = useIsMinter(contract);

  const finalSteps = useMemo(() => {
    const isLazyMintable = (() => {
      if (isErc721) {
        return ERC721Ext.isLazyMintSupported(functionSelectors);
      }
      if (isErc1155) {
        return ERC1155Ext.isLazyMintSupported(functionSelectors);
      }
      return false;
    })();

    const nftIsMintable = (() => {
      if (isErc721) {
        return ERC721Ext.isMintToSupported(functionSelectors);
      }
      if (isErc1155) {
        return ERC1155Ext.isMintToSupported(functionSelectors);
      }
      return false;
    })();

    const isRevealable = ERC721Ext.isRevealSupported(functionSelectors);
    const needsReveal = batchesToReveal.data?.length;

    const steps: Step[] = [
      {
        title: "Contract deployed",
        children: null,
        completed: true,
      },
    ];
    if (isLazyMintable && isMinter) {
      steps.push({
        title: "First NFT uploaded",
        children: (
          <p className="text-muted-foreground text-sm">
            Head to the{" "}
            <Link
              href={nftHref}
              className="text-link-foreground hover:text-foreground"
            >
              NFTs tab
            </Link>{" "}
            to upload your NFT metadata.
          </p>
        ),
        // can be either 721 or 1155
        completed: (nftsQuery.data?.length || 0) > 0,
      });
    }

    if (ERC721Ext.isSharedMetadataSupported(functionSelectors)) {
      steps.push({
        title: "Set NFT Metadata",
        children: (
          <p className="text-muted-foreground text-sm">
            Head to the{" "}
            <Link
              href={nftHref}
              className="text-link-foreground hover:text-foreground"
            >
              NFTs tab
            </Link>{" "}
            to set your NFT metadata.
          </p>
        ),
        completed: !!sharedMetadataQuery?.data,
      });
    }

    if (hasERC721ClaimConditions || hasERC20ClaimConditions) {
      steps.push({
        title: "Set Claim Conditions",
        children: (
          <p className="text-muted-foreground text-sm">
            Head to the{" "}
            <Link
              href={claimConditionsHref}
              className="text-link-foreground hover:text-foreground"
            >
              Claim Conditions tab
            </Link>{" "}
            to set your claim conditions. Users will be able to claim your drop
            only if a claim phase is active.
          </p>
        ),
        completed:
          (claimConditions.data?.length || 0) > 0 ||
          (erc721Claimed.data || 0n) > 0n ||
          (erc20Supply.data || 0n) > 0n,
      });
    }
    if (hasERC721ClaimConditions && isErc721) {
      steps.push({
        title: "First NFT claimed",
        children: (
          <p className="text-muted-foreground text-sm">
            No NFTs have been claimed so far.
          </p>
        ),
        completed: (erc721Claimed.data || 0n) > 0n,
      });
    }

    if (hasERC20ClaimConditions) {
      steps.push({
        title: "First token claimed",
        children: (
          <p className="text-muted-foreground text-sm">
            No tokens have been claimed so far.
          </p>
        ),
        completed: (erc20Supply.data || 0n) > 0n,
      });
    }

    if (isErc20 && ERC20Ext.isMintToSupported(functionSelectors) && isMinter) {
      steps.push({
        title: "First token minted",
        children: (
          <p className="text-muted-foreground text-sm">
            Head to the{" "}
            <Link
              href={tokenHref}
              className="text-link-foreground hover:text-foreground"
            >
              token tab
            </Link>{" "}
            to mint your first token.
          </p>
        ),
        completed: (erc20Supply.data || 0n) > 0n,
      });
    }

    if (nftIsMintable && isMinter) {
      steps.push({
        title: "First NFT minted",
        children: (
          <p className="text-muted-foreground text-sm">
            Head to the{" "}
            <Link
              href={nftHref}
              className="text-link-foreground hover:text-foreground"
            >
              NFTs tab
            </Link>{" "}
            to mint your first token.
          </p>
        ),
        // can be either 721 or 1155
        completed: (nftsQuery.data?.length || 0) > 0,
      });
    }

    if (accountFactory) {
      steps.push({
        title: "First account created",
        children: (
          <p className="text-muted-foreground text-sm">
            Head to the{" "}
            <Link
              href={accountsHref}
              className="text-link-foreground hover:text-foreground"
            >
              Accounts tab
            </Link>{" "}
            to create your first account.
          </p>
        ),
        completed: (accounts.data?.length || 0) > 0,
      });
    }

    if (isRevealable && needsReveal) {
      steps.push({
        title: "NFTs revealed",
        children: (
          <p className="text-muted-foreground text-sm">
            Head to the{" "}
            <Link
              href={nftHref}
              className="text-link-foreground hover:text-foreground"
            >
              NFTs tab
            </Link>{" "}
            to reveal your NFTs.
          </p>
        ),
        // This is always false because if there are batches to reveal, the step doesn't show.
        completed: false,
      });
    }

    return steps;
  }, [
    hasERC20ClaimConditions,
    hasERC721ClaimConditions,
    accountFactory,
    functionSelectors,
    nftsQuery.data,
    sharedMetadataQuery.data,
    claimConditions.data,
    erc721Claimed.data,
    erc20Supply.data,
    accounts.data,
    batchesToReveal.data,
    isErc721,
    isErc1155,
    isErc20,
    isMinter,
    nftHref,
    tokenHref,
    accountsHref,
    claimConditionsHref,
  ]);

  if (finalSteps.length === 1) {
    return null;
  }

  return (
    <StepsCard title="Contract checklist" steps={finalSteps} delay={1000} />
  );
}
