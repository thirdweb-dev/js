import { ContractWrapper } from "../../core/classes/internal/contract-wrapper";
import type {
  ClaimCondition,
  ClaimVerification,
} from "../../types/claim-conditions/claim-conditions";
import { SnapshotFormatVersion } from "../sharded-merkle-tree";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, type BigNumberish, constants, utils } from "ethers";
import { approveErc20Allowance } from "../currency/approveErc20Allowance";
import { isNativeToken } from "../currency/isNativeToken";
import { normalizePriceValue } from "../currency/normalizePriceValue";
import { convertQuantityToBigNumber } from "./convertQuantityToBigNumber";
import { fetchSnapshotEntryForAddress } from "./fetchSnapshotEntryForAddress";

/**
 * Returns proofs and the overrides required for the transaction.
 * @internal
 * @returns - `overrides` and `proofs` as an object.
 */
export async function prepareClaim(
  addressToClaim: string,
  quantity: BigNumberish,
  activeClaimCondition: ClaimCondition,
  merkleMetadataFetcher: () => Promise<Record<string, string>>,
  tokenDecimals: number,
  contractWrapper: ContractWrapper<any>,
  storage: ThirdwebStorage,
  checkERC20Allowance: boolean,
  snapshotFormatVersion: SnapshotFormatVersion,
): Promise<ClaimVerification> {
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
            ? constants.MaxUint256
            : utils.parseUnits(snapshotEntry.maxClaimable, tokenDecimals);
        priceInProof =
          snapshotEntry.price === undefined ||
          snapshotEntry.price === "unlimited"
            ? constants.MaxUint256
            : await normalizePriceValue(
                contractWrapper.getProvider(),
                snapshotEntry.price,
                snapshotEntry.currencyAddress || constants.AddressZero,
              );
        currencyAddressInProof =
          snapshotEntry.currencyAddress || constants.AddressZero;
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

  const overrides = (await contractWrapper.getCallOverrides()) || {};
  // the actual price to check allowance against
  // if proof price is unlimited, then we use the price from the claim condition
  // this mimics the contract behavior
  const pricePerToken =
    priceInProof.toString() !== constants.MaxUint256.toString()
      ? priceInProof
      : activeClaimCondition.price;
  // same for currency address
  const currencyAddress =
    currencyAddressInProof !== constants.AddressZero
      ? currencyAddressInProof
      : activeClaimCondition.currencyAddress;
  if (pricePerToken.gt(0)) {
    if (isNativeToken(currencyAddress)) {
      overrides["value"] = BigNumber.from(pricePerToken)
        .mul(quantity)
        .div(utils.parseUnits("1", tokenDecimals));
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
    price: pricePerToken,
    currencyAddress: currencyAddress,
    priceInProof,
    currencyAddressInProof,
  };
}
