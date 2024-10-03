import type { ThirdwebContract } from "../../../contract/contract.js";
import { upload } from "../../../storage/upload.js";
import type { Hex } from "../../encoding/hex.js";
import { getSetClaimConditionPhases } from "./get-set-claim-condition-phases.js";
import type { ClaimConditionsInput } from "./types.js";

export async function getMulticallSetClaimConditionTransactions(options: {
  phases: ClaimConditionsInput[];
  contract: ThirdwebContract;
  tokenDecimals: number;
  tokenId?: bigint;
  resetClaimEligibility?: boolean;
}): Promise<Hex[]> {
  const { merkleInfos, phases } = await getSetClaimConditionPhases(options);
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
  let encodedSetClaimConditions: Hex;
  if (options.tokenId !== undefined) {
    // 1155
    const { encodeSetClaimConditions } = await import(
      "../../../extensions/erc1155/__generated__/IDrop1155/write/setClaimConditions.js"
    );
    encodedSetClaimConditions = encodeSetClaimConditions({
      tokenId: options.tokenId,
      phases,
      resetClaimEligibility: options.resetClaimEligibility || false,
    });
  } else {
    // 721
    const { encodeSetClaimConditions } = await import(
      "../../../extensions/erc721/__generated__/IDrop/write/setClaimConditions.js"
    );
    encodedSetClaimConditions = encodeSetClaimConditions({
      phases,
      resetClaimEligibility: options.resetClaimEligibility || false,
    });
  }
  encodedTransactions.push(encodedSetClaimConditions);
  return encodedTransactions;
}
