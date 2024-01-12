import { NATIVE_TOKEN_ADDRESS } from "../../constants/currency";
import {
  AbstractClaimConditionContractStruct,
  ClaimConditionInputArray,
} from "../../schema/contracts/common/claim-conditions";
import type {
  ClaimConditionInput,
  SnapshotInfo,
  FilledConditionInput,
} from "../../types/claim-conditions/claim-conditions";
import { SnapshotFormatVersion } from "../sharded-merkle-tree";
import { createSnapshot } from "../snapshots";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  type BigNumberish,
  constants,
  type providers,
  utils,
} from "ethers";
import { normalizePriceValue } from "../currency/normalizePriceValue";
import { convertQuantityToBigNumber } from "./convertQuantityToBigNumber";

function compare(a: BigNumberish, b: BigNumberish) {
  const left = BigNumber.from(a);
  const right = BigNumber.from(b);
  if (left.eq(right)) {
    return 0;
  } else if (left.gt(right)) {
    return 1;
  } else {
    return -1;
  }
}

/**
 * @internal
 * Decorates claim conditions with merkle roots from snapshots if present
 * @param claimConditionInputs - The claim conditions to process
 * @param tokenDecimals - The token decimals to use
 * @param provider - The provider to use
 * @param storage - The storage to use
 * @param snapshotFormatVersion - The snapshot format version to use
 */
async function processSnapshotData(
  claimConditionInputs: ClaimConditionInput[],
  tokenDecimals: number,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  snapshotFormatVersion: SnapshotFormatVersion,
) {
  const snapshotInfos: SnapshotInfo[] = [];
  const inputsWithSnapshots = await Promise.all(
    claimConditionInputs.map(async (conditionInput) => {
      // check snapshots and upload if provided
      if (conditionInput.snapshot && conditionInput.snapshot.length > 0) {
        const snapshotInfo = await createSnapshot(
          conditionInput.snapshot,
          tokenDecimals,
          provider,
          storage,
          snapshotFormatVersion,
        );
        snapshotInfos.push(snapshotInfo);
        conditionInput.merkleRootHash = snapshotInfo.merkleRoot;
      } else {
        // if no snapshot is passed or empty, reset the merkle root
        conditionInput.merkleRootHash = utils.hexZeroPad([0], 32);
      }
      // fill condition with defaults values if not provided
      return conditionInput;
    }),
  );
  return { inputsWithSnapshots, snapshotInfos };
}

/**
 * Converts a local SDK model to contract model
 * @param c - The condition input
 * @param tokenDecimals - The token decimals to use
 * @param provider - The provider to use
 * @param storage - The storage to use
 * @internal
 */
async function convertToContractModel(
  c: FilledConditionInput,
  tokenDecimals: number,
  provider: providers.Provider,
  storage: ThirdwebStorage,
): Promise<AbstractClaimConditionContractStruct> {
  const currency =
    c.currencyAddress === constants.AddressZero
      ? NATIVE_TOKEN_ADDRESS
      : c.currencyAddress;
  const maxClaimableSupply = convertQuantityToBigNumber(
    c.maxClaimableSupply,
    tokenDecimals,
  );
  const maxClaimablePerWallet = convertQuantityToBigNumber(
    c.maxClaimablePerWallet,
    tokenDecimals,
  );
  let metadataOrUri;
  if (c.metadata) {
    if (typeof c.metadata === "string") {
      metadataOrUri = c.metadata;
    } else {
      metadataOrUri = await storage.upload(c.metadata);
    }
  }
  return {
    startTimestamp: c.startTime,
    maxClaimableSupply,
    supplyClaimed: 0,
    maxClaimablePerWallet,
    pricePerToken: await normalizePriceValue(provider, c.price, currency),
    currency,
    merkleRoot: c.merkleRootHash.toString(),
    waitTimeInSecondsBetweenClaims: c.waitInSeconds || 0,
    metadata: metadataOrUri,
  };
}

/**
 * Create and uploads snapshots + converts claim conditions to contract format
 * @param claimConditionInputs - The claim conditions to process
 * @param tokenDecimals - The token decimals to use
 * @param provider - The provider to use
 * @param storage - The storage to use
 * @param snapshotFormatVersion - The snapshot format version to use
 * @internal
 */
export async function processClaimConditionInputs(
  claimConditionInputs: ClaimConditionInput[],
  tokenDecimals: number,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  snapshotFormatVersion: SnapshotFormatVersion,
) {
  const { inputsWithSnapshots, snapshotInfos } = await processSnapshotData(
    claimConditionInputs,
    tokenDecimals,
    provider,
    storage,
    snapshotFormatVersion,
  );
  const parsedInputs =
    await ClaimConditionInputArray.parseAsync(inputsWithSnapshots);
  // Convert processed inputs to the format the contract expects, and sort by timestamp
  const sortedConditions: AbstractClaimConditionContractStruct[] = (
    await Promise.all(
      parsedInputs.map((c) =>
        convertToContractModel(c, tokenDecimals, provider, storage),
      ),
    )
  ).sort((a, b) => {
    return compare(a.startTimestamp, b.startTimestamp);
  });
  return { snapshotInfos, sortedConditions };
}
