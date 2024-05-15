import type { Address } from "abitype";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { ID_GATEWAY_ADDRESS } from "../constants.js";

export const ID_GATEWAY_EIP_712_DOMAIN = {
  name: "Farcaster IdGateway",
  version: "1",
  chainId: 10,
  verifyingContract: ID_GATEWAY_ADDRESS,
} as const;

export const ID_GATEWAY_REGISTER_TYPE = [
  { name: "to", type: "address" },
  { name: "recovery", type: "address" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
] as const;

export const ID_GATEWAY_EIP_712_TYPES = {
  domain: ID_GATEWAY_EIP_712_DOMAIN,
  types: { Register: ID_GATEWAY_REGISTER_TYPE },
} as const;

export type RegisterMessage = {
  /** FID custody address */
  to: Address;
  /** FID recovery address */
  recovery: Address;
  /** IdGateway nonce for signer address */
  nonce: bigint;
  /** Unix timestamp when this message expires */
  deadline: bigint;
};

export type SignRegisterOptions = {
  account: Account;
  message: RegisterMessage;
};

/**
 * Constructs the data required for signing a register message in the Farcaster ID Gateway.
 * This includes the EIP-712 domain, types, and the message to be signed.
 * @param message - The register message containing the necessary information for the signature.
 * @returns An object containing the EIP-712 domain, types, and the message, ready to be signed.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getRegisterData } from "thirdweb/extensions/farcaster";
 *
 * const data = getRegisterData(message);
 * ```
 */
export function getRegisterData(message: RegisterMessage) {
  return {
    ...ID_GATEWAY_EIP_712_TYPES,
    primaryType: "Register" as const,
    message,
  };
}

/**
 * Signs the register message for Farcaster ID Gateway.
 * @param options - The signing options.
 * @param options.account - The account to sign the message with.
 * @param options.message - The message to be signed.
 * @returns A promise that resolves to the signature.
 * @extension FARCASTER
 * @example
 * ```ts
 * const signature = await signRegister({ account, message });
 * ```
 */
export async function signRegister({
  account,
  message,
}: SignRegisterOptions): Promise<Hex> {
  const data = getRegisterData(message);
  return account.signTypedData(data);
}
