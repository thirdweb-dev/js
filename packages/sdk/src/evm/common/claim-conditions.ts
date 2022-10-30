import { Quantity } from "../../core/schema/shared";
import { NATIVE_TOKEN_ADDRESS } from "../constants";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import {
  AbstractClaimConditionContractStruct,
  ClaimConditionInputArray,
  ClaimConditionInputSchema,
  ClaimConditionOutputSchema,
} from "../schema/contracts/common/claim-conditions";
import {
  SnapshotEntry,
  SnapshotEntryWithProof,
  SnapshotInputSchema,
  SnapshotSchema,
} from "../schema/contracts/common/snapshots";
import {
  ClaimCondition,
  ClaimConditionInput,
  ClaimVerification,
  FilledConditionInput,
  Price,
  SnapshotInfo,
} from "../types";
import {
  approveErc20Allowance,
  fetchCurrencyValue,
  isNativeToken,
  normalizePriceValue,
} from "./currency";
import {
  ShardedMerkleTree,
  SnapshotFormatVersion,
} from "./sharded-merkle-tree";
import { createSnapshot } from "./snapshots";
import { IDropClaimCondition_V2 } from "@thirdweb-dev/contracts-js/dist/declarations/src/IDropERC20_V2";
import { IClaimCondition } from "@thirdweb-dev/contracts-js/src/IDrop";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  BigNumberish,
  CallOverrides,
  constants,
  ethers,
  providers,
  utils,
} from "ethers";

/**
 * Returns proofs and the overrides required for the transaction.
 * @internal
 * @returns - `overrides` and `proofs` as an object.
 */
export async function prepareClaim(
  quantity: BigNumberish,
  activeClaimCondition: ClaimCondition,
  merkleMetadataFetcher: () => Promise<Record<string, string>>,
  tokenDecimals: number,
  contractWrapper: ContractWrapper<any>,
  storage: ThirdwebStorage,
  checkERC20Allowance: boolean,
  snapshotFormatVersion: SnapshotFormatVersion,
): Promise<ClaimVerification> {
  const addressToClaim = await contractWrapper.getSignerAddress();
  let maxClaimable = convertQuantityToBigNumber(
    activeClaimCondition.maxClaimablePerWallet,
    tokenDecimals,
  );
  let proofs = [utils.hexZeroPad([0], 32)];
  let priceInProof = activeClaimCondition.price; // the price to send to the contract in claim proofs
  let currencyAddressInProof = activeClaimCondition.currencyAddress;
  try {
    if (
      !activeClaimCondition.merkleRootHash
        .toString()
        .startsWith(constants.AddressZero)
    ) {
      const snapshotEntry = await fetchSnapshotEntryForAddress(
        addressToClaim,
        activeClaimCondition.merkleRootHash.toString(),
        await merkleMetadataFetcher(),
        contractWrapper.getProvider(),
        storage,
        snapshotFormatVersion,
      );
      if (snapshotEntry) {
        proofs = snapshotEntry.proof;
        // override only if not default values (unlimited for quantity, zero addr for currency)
        maxClaimable =
          snapshotEntry.maxClaimable === "unlimited"
            ? ethers.constants.MaxUint256
            : ethers.utils.parseUnits(
                snapshotEntry.maxClaimable,
                tokenDecimals,
              );
        priceInProof =
          snapshotEntry.price === "unlimited"
            ? ethers.constants.MaxUint256
            : await normalizePriceValue(
                contractWrapper.getProvider(),
                snapshotEntry.price,
                snapshotEntry.currencyAddress,
              );
        currencyAddressInProof = snapshotEntry.currencyAddress;
      } else {
        // if no snapshot entry, and it's a v1 format (exclusive allowlist) then address can't claim
        if (snapshotFormatVersion === SnapshotFormatVersion.V1) {
          throw new Error("No claim found for this address");
        }
        // but if its snapshot v2 (override list behavior) then address can still claim with default settings
      }
    }
  } catch (e) {
    // have to handle the valid error case that we *do* want to throw on
    if ((e as Error)?.message === "No claim found for this address") {
      throw e;
    }
    // other errors we wanna ignore and try to continue
    console.warn(
      "failed to check claim condition merkle root hash, continuing anyways",
      e,
    );
  }

  // if max claimable is 0 even after checking allowlist, then address can't claim (only with override list behavior)
  if (
    snapshotFormatVersion === SnapshotFormatVersion.V2 &&
    maxClaimable.eq(0)
  ) {
    throw new Error(`Cannot claim, max claimable is 0 for ${addressToClaim}`);
  }

  const overrides = (await contractWrapper.getCallOverrides()) || {};
  // the actual price to check allowance against
  // if proof price is unlimited, then we use the price from the claim condition
  // this mimics the contract behavior
  const pricePerToken =
    priceInProof.toString() !== ethers.constants.MaxUint256.toString()
      ? priceInProof
      : activeClaimCondition.price;
  // same for currency address
  const currencyAddress =
    currencyAddressInProof !== ethers.constants.AddressZero
      ? currencyAddressInProof
      : activeClaimCondition.currencyAddress;
  if (pricePerToken.gt(0)) {
    if (isNativeToken(currencyAddress)) {
      overrides["value"] = BigNumber.from(pricePerToken)
        .mul(quantity)
        .div(ethers.utils.parseUnits("1", tokenDecimals));
    } else if (checkERC20Allowance) {
      await approveErc20Allowance(
        contractWrapper,
        currencyAddress,
        pricePerToken,
        quantity,
        tokenDecimals,
      );
    }
  }
  return {
    overrides,
    proofs,
    maxClaimable,
    price: priceInProof,
    currencyAddress: currencyAddressInProof,
  };
}

/**
 * @internal
 * @param merkleRoot
 * @param merkleMetadata
 * @param storage
 */
export async function fetchSnapshot(
  merkleRoot: string,
  merkleMetadata: Record<string, string> | undefined,
  storage: ThirdwebStorage,
): Promise<SnapshotEntry[] | null> {
  if (!merkleMetadata) {
    return null;
  }
  const snapshotUri = merkleMetadata[merkleRoot];
  if (snapshotUri) {
    const raw = await storage.downloadJSON(snapshotUri);
    if (raw.isShardedMerkleTree && raw.merkleRoot === merkleRoot) {
      const smt = await ShardedMerkleTree.fromUri(snapshotUri, storage);
      return smt?.getAllEntries() || null;
    } else {
      const snapshotData = SnapshotSchema.parse(raw);
      if (merkleRoot === snapshotData.merkleRoot) {
        return snapshotData.claims.map((claim) => ({
          address: claim.address,
          maxClaimable: claim.maxClaimable,
          price: claim.price,
          currencyAddress: claim.currencyAddress,
        }));
      }
    }
  }
  return null;
}

export async function fetchSnapshotEntryForAddress(
  address: string,
  merkleRoot: string,
  merkleMetadata: Record<string, string> | undefined,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
  snapshotFormatVersion: SnapshotFormatVersion,
): Promise<SnapshotEntryWithProof | null> {
  if (!merkleMetadata) {
    return null;
  }
  const snapshotUri = merkleMetadata[merkleRoot];
  if (snapshotUri) {
    const raw = await storage.downloadJSON(snapshotUri);
    if (raw.isShardedMerkleTree && raw.merkleRoot === merkleRoot) {
      const merkleTree = await ShardedMerkleTree.fromShardedMerkleTreeInfo(
        raw,
        storage,
      );
      return await merkleTree.getProof(
        address,
        provider,
        snapshotFormatVersion,
      );
    }
    // legacy non-sharded, just fetch it all and filter out
    const snapshotData = SnapshotSchema.parse(raw);
    if (merkleRoot === snapshotData.merkleRoot) {
      return (
        snapshotData.claims.find(
          (c) => c.address.toLowerCase() === address.toLowerCase(),
        ) || null
      );
    }
  }
  return null;
}

/**
 * @internal
 * @param index
 * @param claimConditionInput
 * @param existingConditions
 */
export async function updateExistingClaimConditions(
  index: number,
  claimConditionInput: ClaimConditionInput,
  existingConditions: ClaimCondition[],
): Promise<ClaimConditionInput[]> {
  if (index >= existingConditions.length) {
    throw Error(
      `Index out of bounds - got index: ${index} with ${existingConditions.length} conditions`,
    );
  }
  // merge input with existing claim condition
  const priceDecimals = existingConditions[index].currencyMetadata.decimals;
  const priceInWei = existingConditions[index].price;
  const priceInTokens = ethers.utils.formatUnits(priceInWei, priceDecimals);

  // merge existing (output format) with incoming (input format)
  const newConditionParsed = ClaimConditionInputSchema.parse({
    ...existingConditions[index],
    price: priceInTokens,
    ...claimConditionInput,
  });

  // convert to output claim condition
  const mergedConditionOutput = ClaimConditionOutputSchema.parse({
    ...newConditionParsed,
    price: priceInWei,
  });

  return existingConditions.map((existingOutput, i) => {
    let newConditionAtIndex;
    if (i === index) {
      newConditionAtIndex = mergedConditionOutput;
    } else {
      newConditionAtIndex = existingOutput;
    }
    const formattedPrice = ethers.utils.formatUnits(
      newConditionAtIndex.price,
      priceDecimals,
    );
    return {
      ...newConditionAtIndex,
      price: formattedPrice, // manually transform back to input price type
    };
  });
}

/**
 * Fetches the proof for the current signer for a particular wallet.
 *
 * @param addressToClaim
 * @param merkleRoot - The merkle root of the condition to check.
 * @param tokenDecimals
 * @param merkleMetadata
 * @param storage
 * @param provider
 * @param snapshotFormatVersion
 * @returns - The proof for the current signer for the specified condition.
 */
export async function getClaimerProofs(
  addressToClaim: string,
  merkleRoot: string,
  tokenDecimals: number,
  merkleMetadata: Record<string, string>,
  storage: ThirdwebStorage,
  provider: ethers.providers.Provider,
  snapshotFormatVersion: SnapshotFormatVersion,
): Promise<
  | {
      proof: string[];
      maxClaimable: BigNumber;
      price: BigNumber;
      currencyAddress: string;
    }
  | undefined
> {
  const claim = await fetchSnapshotEntryForAddress(
    addressToClaim,
    merkleRoot,
    merkleMetadata,
    provider,
    storage,
    snapshotFormatVersion,
  );
  if (!claim) {
    return undefined;
  }
  const price =
    claim.price === "unlimited"
      ? ethers.constants.MaxUint256
      : await normalizePriceValue(provider, claim.price, claim.currencyAddress);
  const maxClaimable =
    claim.maxClaimable === "unlimited"
      ? ethers.constants.MaxUint256
      : ethers.utils.parseUnits(claim.maxClaimable, tokenDecimals);
  return {
    proof: claim.proof,
    maxClaimable,
    price,
    currencyAddress: claim.currencyAddress,
  };
}

/**
 * @internal
 * Decorates claim conditions with merkle roots from snapshots if present
 * @param claimConditionInputs
 * @param tokenDecimals
 * @param provider
 * @param storage
 * @param snapshotFormatVersion
 */
async function processSnapshotData(
  claimConditionInputs: ClaimConditionInput[],
  tokenDecimals: number,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
  snapshotFormatVersion: SnapshotFormatVersion,
) {
  const snapshotInfos: SnapshotInfo[] = [];
  const inputsWithSnapshots = await Promise.all(
    claimConditionInputs.map(async (conditionInput) => {
      // check snapshots and upload if provided
      if (conditionInput.snapshot && conditionInput.snapshot.length > 0) {
        const snapshotInfo = await createSnapshot(
          SnapshotInputSchema.parse(conditionInput.snapshot),
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
 * Create and uploads snapshots + converts claim conditions to contract format
 * @param claimConditionInputs
 * @param tokenDecimals
 * @param provider
 * @param storage
 * @param snapshotFormatVersion
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
  const parsedInputs = ClaimConditionInputArray.parse(inputsWithSnapshots);
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

/**
 * Converts a local SDK model to contract model
 * @param c
 * @param tokenDecimals
 * @param provider
 * @param storage
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

export function abstractContractModelToLegacy(
  model: AbstractClaimConditionContractStruct,
): IDropClaimCondition_V2.ClaimConditionStruct {
  return {
    startTimestamp: model.startTimestamp,
    maxClaimableSupply: model.maxClaimableSupply,
    supplyClaimed: model.supplyClaimed,
    merkleRoot: model.merkleRoot,
    pricePerToken: model.pricePerToken,
    currency: model.currency,
    quantityLimitPerTransaction: model.maxClaimablePerWallet,
    waitTimeInSecondsBetweenClaims: model.waitTimeInSecondsBetweenClaims || 0,
  };
}

export function abstractContractModelToNew(
  model: AbstractClaimConditionContractStruct,
): IClaimCondition.ClaimConditionStruct {
  return {
    startTimestamp: model.startTimestamp,
    maxClaimableSupply: model.maxClaimableSupply,
    supplyClaimed: model.supplyClaimed,
    merkleRoot: model.merkleRoot,
    pricePerToken: model.pricePerToken,
    currency: model.currency,
    quantityLimitPerWallet: model.maxClaimablePerWallet,
    metadata: model.metadata || "",
  };
}

export function legacyContractModelToAbstract(
  model: IDropClaimCondition_V2.ClaimConditionStruct,
): AbstractClaimConditionContractStruct {
  return {
    startTimestamp: model.startTimestamp,
    maxClaimableSupply: model.maxClaimableSupply,
    supplyClaimed: model.supplyClaimed,
    merkleRoot: model.merkleRoot.toString(),
    pricePerToken: model.pricePerToken,
    currency: model.currency,
    maxClaimablePerWallet: model.quantityLimitPerTransaction,
    waitTimeInSecondsBetweenClaims: model.waitTimeInSecondsBetweenClaims,
  };
}

export function newContractModelToAbstract(
  model: IClaimCondition.ClaimConditionStruct,
): AbstractClaimConditionContractStruct {
  return {
    startTimestamp: model.startTimestamp,
    maxClaimableSupply: model.maxClaimableSupply,
    supplyClaimed: model.supplyClaimed,
    merkleRoot: model.merkleRoot.toString(),
    pricePerToken: model.pricePerToken,
    currency: model.currency,
    maxClaimablePerWallet: model.quantityLimitPerWallet,
    waitTimeInSecondsBetweenClaims: 0,
    metadata: model.metadata,
  };
}

/**
 * Transforms a contract model to local model
 * @param pm
 * @param tokenDecimals
 * @param provider
 * @param merkleMetadata
 * @param storage
 * @param shouldDownloadSnapshot
 * @internal
 */
export async function transformResultToClaimCondition(
  pm: AbstractClaimConditionContractStruct,
  tokenDecimals: number,
  provider: providers.Provider,
  merkleMetadata: Record<string, string> | undefined,
  storage: ThirdwebStorage,
  shouldDownloadSnapshot: boolean,
): Promise<ClaimCondition> {
  const cv = await fetchCurrencyValue(provider, pm.currency, pm.pricePerToken);

  const maxClaimableSupply = convertToReadableQuantity(
    pm.maxClaimableSupply,
    tokenDecimals,
  );
  const maxClaimablePerWallet = convertToReadableQuantity(
    pm.maxClaimablePerWallet,
    tokenDecimals,
  );
  const availableSupply = convertToReadableQuantity(
    BigNumber.from(pm.maxClaimableSupply).sub(pm.supplyClaimed),
    tokenDecimals,
  );
  const currentMintSupply = convertToReadableQuantity(
    pm.supplyClaimed,
    tokenDecimals,
  );
  return ClaimConditionOutputSchema.parse({
    startTime: pm.startTimestamp,
    maxClaimableSupply,
    maxClaimablePerWallet,
    currentMintSupply,
    availableSupply,
    waitInSeconds: pm.waitTimeInSecondsBetweenClaims?.toString(),
    price: BigNumber.from(pm.pricePerToken),
    currency: pm.currency,
    currencyAddress: pm.currency,
    currencyMetadata: cv,
    merkleRootHash: pm.merkleRoot,
    snapshot: shouldDownloadSnapshot
      ? await fetchSnapshot(pm.merkleRoot, merkleMetadata, storage)
      : undefined,
    metadata: pm.metadata,
  });
}

/**
 * @internal
 * @param bn
 * @param tokenDecimals
 */
export function convertToReadableQuantity(
  bn: BigNumberish,
  tokenDecimals: number,
) {
  if (bn.toString() === ethers.constants.MaxUint256.toString()) {
    return "unlimited";
  } else {
    return ethers.utils.formatUnits(bn, tokenDecimals);
  }
}

/**
 * @internal
 * @param quantity
 * @param tokenDecimals
 */
export function convertQuantityToBigNumber(
  quantity: Quantity,
  tokenDecimals: number,
) {
  if (quantity === "unlimited") {
    return ethers.constants.MaxUint256;
  } else {
    return ethers.utils.parseUnits(quantity, tokenDecimals);
  }
}

export async function calculateClaimCost(
  contractWrapper: ContractWrapper<any>,
  pricePerToken: Price,
  quantity: BigNumberish,
  currencyAddress?: string,
  checkERC20Allowance?: boolean,
): Promise<Promise<CallOverrides>> {
  let overrides: CallOverrides = {};
  const currency = currencyAddress || NATIVE_TOKEN_ADDRESS;
  const normalizedPrice = await normalizePriceValue(
    contractWrapper.getProvider(),
    pricePerToken,
    currency,
  );
  const totalCost = normalizedPrice.mul(quantity);
  if (totalCost.gt(0)) {
    if (currency === NATIVE_TOKEN_ADDRESS) {
      overrides = {
        value: totalCost,
      };
    } else if (currency !== NATIVE_TOKEN_ADDRESS && checkERC20Allowance) {
      await approveErc20Allowance(
        contractWrapper,
        currency,
        totalCost,
        quantity,
        0,
      );
    }
  }
  return overrides;
}
