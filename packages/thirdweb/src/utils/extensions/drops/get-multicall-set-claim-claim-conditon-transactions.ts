import { maxUint256 } from "viem";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { SetClaimConditionsParams as GeneratedParams } from "../../../extensions/erc1155/__generated__/IDrop1155/write/setClaimConditions.js";
import { upload } from "../../../storage/upload.js";
import { dateToSeconds } from "../../date.js";
import { type Hex, toHex } from "../../encoding/hex.js";
import { convertErc20Amount } from "../convert-erc20-amount.js";
import { processOverrideList } from "./process-override-list.js";
import type { ClaimConditionsInput } from "./types.js";

export async function getMulticallSetClaimConditionTransactions(options: {
  phases: ClaimConditionsInput[];
  contract: ThirdwebContract;
  tokenDecimals: number;
  tokenId?: bigint;
  resetClaimEligibility?: boolean;
}): Promise<Hex[]> {
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
  const encodedTransactions: Hex[] = [];
  // if we have new merkle roots, we need to upload them to the contract metadata
  if (Object.keys(merkleInfos).length > 0) {
    const [{ getContractMetadata }, { encodeSetContractURI }] =
      await Promise.all([
        import("../../../extensions/common/read/getContractMetadata.js"),
        import(
          "../../../extensions/common/__generated__/IContractMetadata/write/setContractURI.js"
        ),
      ]);
    const metadata = await getContractMetadata({
      contract: options.contract,
    });
    // keep the old merkle roots from other tokenIds
    for (const key of Object.keys(metadata.merkle || {})) {
      merkleInfos[key] = metadata.merkle[key];
    }
    const mergedMetadata = {
      ...metadata,
      merkle: merkleInfos,
    };
    const uri = await upload({
      client: options.contract.client,
      files: [mergedMetadata],
    });
    const encodedSetContractURI = encodeSetContractURI({
      uri,
    });
    encodedTransactions.push(encodedSetContractURI);
  }
  const sortedPhases = phases.sort((a, b) =>
    Number(a.startTimestamp - b.startTimestamp),
  );
  let encodedSetClaimConditions: Hex;
  if (options.tokenId !== undefined) {
    // 1155
    const { encodeSetClaimConditions } = await import(
      "../../../extensions/erc1155/__generated__/IDrop1155/write/setClaimConditions.js"
    );
    encodedSetClaimConditions = encodeSetClaimConditions({
      tokenId: options.tokenId,
      phases: sortedPhases,
      resetClaimEligibility: options.resetClaimEligibility || false,
    });
  } else {
    // 721
    const { encodeSetClaimConditions } = await import(
      "../../../extensions/erc721/__generated__/IDrop/write/setClaimConditions.js"
    );
    encodedSetClaimConditions = encodeSetClaimConditions({
      phases: sortedPhases,
      resetClaimEligibility: options.resetClaimEligibility || false,
    });
  }
  encodedTransactions.push(encodedSetClaimConditions);
  return encodedTransactions;
}
