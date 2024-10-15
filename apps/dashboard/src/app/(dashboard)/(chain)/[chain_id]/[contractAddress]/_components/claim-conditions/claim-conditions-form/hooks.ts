import {
  type BaseTransactionOptions,
  type ThirdwebClient,
  toTokens,
} from "thirdweb";
import type { OverrideEntry } from "thirdweb/dist/types/utils/extensions/drops/types";
import type { Prettify } from "thirdweb/dist/types/utils/type-utils";
import { getContractMetadata } from "thirdweb/extensions/common";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { download } from "thirdweb/storage";
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

type CombinedClaimCondition = Prettify<
  Omit<
    LegacyClaimCondition,
    "price" | "waitInSeconds" | "availableSupply" | "currencyMetadata"
  > & {
    price: bigint;
    currencyMetadata: Omit<
      LegacyClaimCondition["currencyMetadata"],
      "value"
    > & {
      value: bigint;
    };
  }
>;

type Options =
  | {
      type: "erc20";
    }
  | {
      type: "erc721";
    }
  | {
      type: "erc1155";
      tokenId: bigint;
    };

export async function getClaimPhasesInLegacyFormat(
  options: BaseTransactionOptions<Options>,
): Promise<CombinedClaimCondition[]> {
  const conditions = await (async () => {
    switch (options.type) {
      case "erc20":
        return ERC20Ext.getClaimConditions(options);
      case "erc721":
        return ERC721Ext.getClaimConditions(options);
      case "erc1155":
        return ERC1155Ext.getClaimConditions(options);
    }
  })();

  return Promise.all(
    conditions.map(async (condition) => {
      const [currencyMetadata, metadata, contractMetadata] = await Promise.all([
        await ERC20Ext.getCurrencyMetadata({
          contract: { ...options.contract, address: condition.currency },
        }).then((m) => ({
          ...m,
          displayValue: toTokens(condition.pricePerToken, m.decimals),
          value: condition.pricePerToken,
        })),
        download({
          uri: condition.metadata,
          client: options.contract.client,
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
        startTime: new Date(Number(condition.startTimestamp * 1000n)),
        currencyAddress: condition.currency,
        price: condition.pricePerToken,
        maxClaimableSupply: toUnlimited(condition.maxClaimableSupply),
        currencyMetadata,
        currentMintSupply: (
          condition.maxClaimableSupply - condition.supplyClaimed
        ).toString(),
        maxClaimablePerWallet: toUnlimited(condition.quantityLimitPerWallet),
        merkleRootHash: condition.merkleRoot,
        metadata,
        snapshot,
      } satisfies CombinedClaimCondition;
    }),
  );
}

type PhaseInput = z.input<typeof LegacyClaimConditionInputSchema>;

export function setClaimPhasesTx(
  baseOptions: BaseTransactionOptions<Options>,
  rawPhases: PhaseInput[],
) {
  const phases = rawPhases.map((phase) => {
    return {
      startTime: toDate(phase.startTime),
      maxClaimableSupply: toBigInt(phase.maxClaimableSupply),
      maxClaimablePerWallet: toBigInt(phase.maxClaimablePerWallet),
      merkleRootHash: phase.merkleRootHash as string | undefined,
      overrideList: phase.snapshot?.length
        ? snapshotToOverrides(phase.snapshot)
        : undefined,
      price: phase.price?.toString(),
      currencyAddress: phase.currencyAddress,
      metadata: phase.metadata,
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
      maxClaimable: entry.maxClaimable?.toString(),
      price: entry.price?.toString(),
      currencyAddress: entry.currencyAddress,
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
function toBigInt(value: string | number | undefined) {
  if (value === undefined) {
    return undefined;
  }
  if (value === "unlimited") {
    return maxUint256;
  }
  return BigInt(value);
}

function toUnlimited(value: bigint) {
  return value === maxUint256 ? "unlimited" : value.toString();
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
        uri: snapshotUri,
        client: client,
      }).then((r) => r.json());
      if (raw.isShardedMerkleTree && raw.merkleRoot === merkleRoot) {
        return download({
          uri: raw.originalEntriesUri,
          client: client,
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
            maxClaimable: claim.maxClaimable,
            price: claim.price,
            currencyAddress: claim.currencyAddress,
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
