import { ed25519 } from "@noble/curves/ed25519";
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
 * ```ts
 * createSigner()
 * ```
 * @extension FARCASTER
 */
export async function createEd25519Keypair(): Promise<Ed25519Keypair> {
  const privateKey = ed25519.utils.randomPrivateKey();
  const publicKey = ed25519.getPublicKey(privateKey);
  return {
    publicKey: fromBytes(publicKey, "hex"),
    privateKey: fromBytes(privateKey, "hex"),
  };
}
