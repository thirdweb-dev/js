import { secp256k1 } from "@noble/curves/secp256k1";
import type { Account } from "../interfaces/wallet.js";
import { toHex } from "../../utils/encoding/hex.js";
import { privateKeyAccount } from "../private-key.js";
import type { ThirdwebClient } from "../../client/client.js";

export type GenerateAccountOptions = {
  client: ThirdwebClient;
};

/**
 * Generates a new wallet with a random private key.
 * @param options - The options for generating the wallet.
 * @param options.client - The Thirdweb client to use for the generated wallet.
 * @returns A Thirdweb wallet.
 * @example
 * ```ts
 * import { generateAccount } from "thirdweb/wallets";
 * const wallet = await generateAccount({ client });
 * ```
 * @walletUtils
 */
export async function generateAccount(
  options: GenerateAccountOptions,
): Promise<Account> {
  const privateKey = toHex(secp256k1.utils.randomPrivateKey());
  return privateKeyAccount({ privateKey, client: options.client });
}
