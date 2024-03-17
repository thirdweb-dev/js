import { fromBytes } from "../../utils/encoding/from-bytes.js";
import type { Hex } from "../../utils/encoding/hex.js";

export type Ed25519Keypair = {
  publicKey: Hex;
  privateKey: Hex;
};

/**
 * Generates an Ed25519 keypair to be used as an account signer.
 * @returns A promise resolving to the generated keypair.
 * @example
 * ```
 * createSigner()
 * ```
 */
export async function createSigner(): Promise<Ed25519Keypair> {
  const ed = await import("@noble/ed25519");
  const privateKey = ed.utils.randomPrivateKey();
  const publicKey = await ed.getPublicKey(privateKey);
  return {
    publicKey: fromBytes(publicKey, "hex"),
    privateKey: fromBytes(privateKey, "hex"),
  };
}
