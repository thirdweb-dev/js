import {
  type BaseTransactionOptions,
  type ThirdwebClient,
  toTokens,
  toUnits,
} from "thirdweb";
import { getContract } from "thirdweb/contract";
import { getContractMetadata } from "thirdweb/extensions/common";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { download } from "thirdweb/storage";
import type { OverrideEntry } from "thirdweb/utils";
import { maxUint256 } from "thirdweb/utils";
import type { z } from "zod";
import type {
  ClaimCondition as LegacyClaimCondition,
  ClaimConditionInputSchema as LegacyClaimConditionInputSchema,
} from "../legacy-zod-schema";

type SnapshotEntry = {
  address: string;
  maxClaimable: string;
  price?: string | undefined;
  currencyAddress?: string | undefined;
};

type CombinedClaimCondition = Omit<
  LegacyClaimCondition,
  "price" | "waitInSeconds" | "availableSupply" | "currencyMetadata"
> & {
  price: bigint;
  currencyMetadata: Omit<LegacyClaimCondition["currencyMetadata"], "value"> & {
    value: bigint;
  };
};

type Options =
  | {
      type: "erc20";
      decimals?: number;
    }
  | {
      type: "erc721";
    }
  | {
      type: "erc1155";
      tokenId: bigint;
    };

export async function getClaimPhasesInLegacyFormat(
  options: BaseTransactionOptions<Options> & { isMultiPhase: boolean },
): Promise<CombinedClaimCondition[]> {
  const conditions = await (async () => {
    switch (options.type) {
      case "erc20":
        return ERC20Ext.getClaimConditions(options);
      case "erc721":
        return ERC721Ext.getClaimConditions(options);
      case "erc1155":
        return ERC1155Ext.getClaimConditions({
          ...options,
          singlePhaseDrop: !options.isMultiPhase,
        });
    }
  })();

  return Promise.all(
    conditions.map(async (condition) => {
      const [currencyMetadata, metadata, contractMetadata] = await Promise.all([
        await ERC20Ext.getCurrencyMetadata({
          contract: getContract({
            ...options.contract,
            address: condition.currency,
          }),
        }).then((m) => ({
          ...m,
          displayValue: toTokens(condition.pricePerToken, m.decimals),
          value: condition.pricePerToken,
        })),
        download({
          client: options.contract.client,
          uri: condition.metadata,
        }).then((r) => r.json()),
        getContractMetadata(options),
      ]);
      const snapshot = await fetchSnapshot(
        condition.merkleRoot,
        contractMetadata.merkle,
        options.contract.client,
      );
      return {
        ...condition,
        currencyAddress: condition.currency,
        currencyMetadata,
        currentMintSupply: (
          condition.maxClaimableSupply - condition.supplyClaimed
        ).toString(),
        maxClaimablePerWallet:
          options.type === "erc20"
            ? convertERC20ValueToDisplayValue(
                condition.quantityLimitPerWallet,
                options.decimals,
              )
            : toUnlimited(condition.quantityLimitPerWallet),
        maxClaimableSupply:
          options.type === "erc20"
            ? convertERC20ValueToDisplayValue(
                condition.maxClaimableSupply,
                options.decimals,
              )
            : toUnlimited(condition.maxClaimableSupply),
        merkleRootHash: condition.merkleRoot,
        metadata,
        price: condition.pricePerToken,
        snapshot,
        startTime: new Date(Number(condition.startTimestamp * 1000n)),
      } satisfies CombinedClaimCondition;
    }),
  );
}

type PhaseInput = z.input<typeof LegacyClaimConditionInputSchema>;

export function setClaimPhasesTx(
  baseOptions: BaseTransactionOptions<Options> & { isSinglePhase?: boolean },
  rawPhases: PhaseInput[],
) {
  const phases = rawPhases.map((phase) => {
    return {
      currencyAddress: phase.currencyAddress,
      maxClaimablePerWallet:
        baseOptions.type === "erc20"
          ? convertERC20ValueToWei(
              phase.maxClaimablePerWallet,
              baseOptions.decimals,
            )
          : toBigInt(phase.maxClaimablePerWallet),
      maxClaimableSupply:
        baseOptions.type === "erc20"
          ? convertERC20ValueToWei(
              phase.maxClaimableSupply,
              baseOptions.decimals,
            )
          : toBigInt(phase.maxClaimableSupply),
      merkleRootHash: phase.merkleRootHash as string | undefined,
      metadata: phase.metadata,
      overrideList: phase.snapshot?.length
        ? snapshotToOverrides(phase.snapshot)
        : undefined,
      price: phase.price?.toString(),
      startTime: toDate(phase.startTime),
    } satisfies ERC20Ext.SetClaimConditionsParams["phases"][0];
  });

  switch (baseOptions.type) {
    case "erc20":
      return ERC20Ext.setClaimConditions({
        contract: baseOptions.contract,
        phases,
      });
    case "erc721":
      return ERC721Ext.setClaimConditions({
        contract: baseOptions.contract,
        phases,
      });
    case "erc1155":
      return ERC1155Ext.setClaimConditions({
        contract: baseOptions.contract,
        phases,
        singlePhaseDrop: baseOptions.isSinglePhase,
        tokenId: baseOptions.tokenId,
      });
  }
}

// HELPERS
function snapshotToOverrides(snapshot: PhaseInput["snapshot"]) {
  if (!snapshot) {
    return [];
  }

  return snapshot.map((entry) => {
    if (typeof entry === "string") {
      return {
        address: entry,
      } satisfies OverrideEntry;
    }
    return {
      address: entry.address,
      currencyAddress: entry.currencyAddress,
      maxClaimable: entry.maxClaimable?.toString(),
      price: entry.price?.toString(),
    } satisfies OverrideEntry;
  });
}
function toDate(timestamp: number | Date | undefined) {
  if (timestamp === undefined) {
    return undefined;
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
}
function toBigInt(value: string | number | undefined): bigint | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === "unlimited") {
    return maxUint256;
  }
  return BigInt(value);
}

// The input from client-side is non-wei, but the extension is expecting value in wei
// so we need to convert it using toUnits
function convertERC20ValueToWei(
  value: string | number | undefined,
  decimals?: number,
) {
  if (value === undefined) {
    return undefined;
  }
  if (value === "unlimited") {
    return maxUint256;
  }
  // The ERC20Claim condition extension in v5 does not convert to wei for us
  // so we have to, manually
  if (decimals) {
    return toUnits(value.toString(), decimals);
  }
  return BigInt(value);
}

// This value we get from ERC20Ext.getClaimConditions is in wei
// so we have to convert it using toTokens for readability, and for users to update
// (when user updates this value, we convert it back to wei - see `function setClaimPhasesTx`)
function convertERC20ValueToDisplayValue(
  value: bigint,
  decimals?: number,
): string {
  if (value === maxUint256) {
    return "unlimited";
  }
  if (decimals) {
    return toTokens(value, decimals);
  }
  return value.toString();
}

function toUnlimited(value: bigint) {
  if (value === maxUint256) {
    return "unlimited";
  }
  return value.toString();
}

async function fetchSnapshot(
  merkleRoot: string,
  merkleMetadata: Record<string, string> | undefined,
  client: ThirdwebClient,
): Promise<SnapshotEntry[] | null> {
  if (!merkleMetadata) {
    return null;
  }

  try {
    const snapshotUri = merkleMetadata[merkleRoot];
    if (snapshotUri) {
      const raw = await download({
        client: client,
        uri: snapshotUri,
      }).then((r) => r.json());
      if (raw.isShardedMerkleTree && raw.merkleRoot === merkleRoot) {
        return download({
          client: client,
          uri: raw.originalEntriesUri,
        })
          .then((r) => r.json())
          .catch(() => null);
      }
      if (merkleRoot === raw.merkleRoot) {
        return raw.claims.map(
          (claim: {
            address: string;
            maxClaimable: bigint;
            price: bigint;
            currencyAddress: string;
          }) => ({
            address: claim.address,
            currencyAddress: claim.currencyAddress,
            maxClaimable: claim.maxClaimable,
            price: claim.price,
          }),
        );
      }
    }
    return null;
  } catch (e) {
    console.error("failed to fetch snapshot", e);
    return null;
  }
}
