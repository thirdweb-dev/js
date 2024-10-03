import { maxUint256 } from "viem";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { SetClaimConditionsParams as GeneratedParams } from "../../../extensions/erc1155/__generated__/IDrop1155/write/setClaimConditions.js";
import { upload } from "../../../storage/upload.js";
import { dateToSeconds } from "../../date.js";
import { toHex } from "../../encoding/hex.js";
import { convertErc20Amount } from "../convert-erc20-amount.js";
import { processOverrideList } from "./process-override-list.js";
import type { ClaimConditionsInput } from "./types.js";

/**
 * @param options
 * @utils
 */
export async function getSetClaimConditionPhases(options: {
  phases: ClaimConditionsInput[];
  contract: ThirdwebContract;
  tokenDecimals: number;
  tokenId?: bigint;
  resetClaimEligibility?: boolean;
}) {
  // We need to expose this function so that some users can use it to print out the value,
  // which they can use with the Explorer
  const merkleInfos: Record<string, string> = {};
  const phases = await Promise.all(
    options.phases.map(async (phase) => {
      // allowlist
      let merkleRoot: string = phase.merkleRootHash || toHex("", { size: 32 });
      if (phase.overrideList) {
        const { shardedMerkleInfo, uri } = await processOverrideList({
          overrides: phase.overrideList,
          client: options.contract.client,
          chain: options.contract.chain,
          tokenDecimals: options.tokenDecimals,
        });
        merkleInfos[shardedMerkleInfo.merkleRoot] = uri;
        merkleRoot = shardedMerkleInfo.merkleRoot;
      }
      // metadata
      let metadata = "";
      if (phase.metadata && typeof phase.metadata === "string") {
        metadata = phase.metadata;
      } else if (phase.metadata && typeof phase.metadata === "object") {
        metadata = await upload({
          client: options.contract.client,
          files: [phase.metadata],
        });
      }
      return {
        startTimestamp: dateToSeconds(phase.startTime ?? new Date(0)),
        currency: phase.currencyAddress || NATIVE_TOKEN_ADDRESS,
        pricePerToken: await convertErc20Amount({
          chain: options.contract.chain,
          client: options.contract.client,
          erc20Address: phase.currencyAddress || NATIVE_TOKEN_ADDRESS,
          amount: phase.price?.toString() ?? "0",
        }),
        maxClaimableSupply: phase.maxClaimableSupply ?? maxUint256,
        quantityLimitPerWallet: phase.maxClaimablePerWallet ?? maxUint256,
        merkleRoot,
        metadata,
        supplyClaimed: 0n,
      } as GeneratedParams["phases"][number];
    }),
  );
  const sortedPhases = phases.sort((a, b) =>
    Number(a.startTimestamp - b.startTimestamp),
  );
  return {
    phases: sortedPhases,
    merkleInfos,
  };
}
