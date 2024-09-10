import { useIsMinter } from "@3rdweb-sdk/react/hooks/useContractRoles";
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
import { AdminOnly } from "../../../../@3rdweb-sdk/react/components/roles/admin-only";
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

export const ContractChecklist: React.FC<ContractChecklistProps> = (props) => {
  const functionSelectorQuery = useContractFunctionSelectors(props.contract);
  return (
    // if no permissions, simply return null (do not fail open)
    <AdminOnly contract={props.contract} failOpen={false}>
      {functionSelectorQuery.data.length > 0 && (
        <Inner functionSelectors={functionSelectorQuery.data} {...props} />
      )}
    </AdminOnly>
  );
};

function Inner({
  contract,
  isErc1155,
  isErc20,
  isErc721,
  functionSelectors,
}: ContractChecklistProps & {
  functionSelectors: string[];
}) {
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
    ].every(Boolean);
  }, [functionSelectors]);

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
    ].every(Boolean);
  }, [functionSelectors]);

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
    queryOptions: { enabled: isErc721 },
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

    if (ERC721Ext.isSharedMetadataSupported(functionSelectors)) {
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
        children: (
          <Text size="label.sm">No NFTs have been claimed so far.</Text>
        ),
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

    if (isErc20 && ERC20Ext.isMintToSupported(functionSelectors) && isMinter) {
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
