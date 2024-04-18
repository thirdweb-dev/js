import { secp256k1 } from "@noble/curves/secp256k1";
import type { ThirdwebClient } from "../../client/client.js";
import { toHex } from "../../utils/encoding/hex.js";
import type { Account } from "../interfaces/wallet.js";
import { privateKeyToAccount } from "../private-key.js";

export type GenerateAccountOptions = {
  client: ThirdwebClient;
};

/**
 * Generates a new account with a random private key.
 * @param options - The options for generating the account.
 * @param options.client - The Thirdweb client to use for the generated account.
 * @returns A Thirdweb account.
 * @example
 * ```ts
 * import { generateAccount } from "thirdweb/wallets";
 * const account = await generateAccount({ client });
 * ```
 * @walletUtils
 */
export async function generateAccount(
  options: GenerateAccountOptions,
): Promise<Account> {
  const privateKey = toHex(secp256k1.utils.randomPrivateKey());
  return privateKeyToAccount({ privateKey, client: options.client });
}
