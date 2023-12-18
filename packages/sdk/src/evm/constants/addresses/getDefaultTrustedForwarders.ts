import { CONTRACT_ADDRESSES } from "./CONTRACT_ADDRESSES";
import { SUPPORTED_CHAIN_ID } from "../chains/SUPPORTED_CHAIN_ID";
import { SUPPORTED_CHAIN_IDS } from "../chains/SUPPORTED_CHAIN_IDS";
import { AddressZero } from "./AddressZero";

/**
 *
 * @param chainId - chain id
 * @returns The array of trusted forwarders for the given chain id
 * @internal
 */
export function getDefaultTrustedForwarders(
  chainId: SUPPORTED_CHAIN_ID,
): string[] {
  const chainEnum = SUPPORTED_CHAIN_IDS.find((c) => c === chainId);
  const biconomyForwarder = chainEnum
    ? CONTRACT_ADDRESSES[chainEnum]?.biconomyForwarder
    : AddressZero;
  const openzeppelinForwarder = chainEnum
    ? CONTRACT_ADDRESSES[chainEnum]?.openzeppelinForwarder
    : AddressZero;
  return [openzeppelinForwarder, biconomyForwarder].filter(
    (a) => a !== AddressZero,
  );
}
