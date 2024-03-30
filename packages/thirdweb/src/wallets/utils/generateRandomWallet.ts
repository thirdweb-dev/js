import { secp256k1 } from "@noble/curves/secp256k1";
import type { Account } from "../interfaces/wallet.js";
import { toHex } from "../../utils/encoding/hex.js";
import { privateKeyAccount } from "../private-key.js";
import type { ThirdwebClient } from "../../client/client.js";

export type GenerateRandomWalletOptions = {
  client: ThirdwebClient;
};

/**
 * Generates a new wallet with a random private key.
 * @param options - The options for generating the wallet.
 * @param options.client - The Thirdweb client to use for the generated wallet.
 * @returns A Thirdweb wallet.
 * @example
 * ```ts
 * import { generateRandomWallet } from "thirdweb/wallets";
 * const wallet = await generateRandomWallet({ client });
 * ```
 * @walletUtils
 */
export async function generateRandomWallet(
  options: GenerateRandomWalletOptions,
): Promise<Account> {
  const privateKey = toHex(secp256k1.utils.randomPrivateKey());
  return privateKeyAccount({ privateKey, client: options.client });
}
