import { fromBytes } from "../../utils/encoding/from-bytes.js";
import type { Hex } from "../../utils/encoding/hex.js";

export type Ed25519Keypair = {
  publicKey: Hex;
  privateKey: Hex;
};

export async function createEd25519Keypair(): Promise<Ed25519Keypair> {
  const ed = await import("@noble/ed25519");
  const privateKey = ed.utils.randomPrivateKey();
  const publicKey = await ed.getPublicKey(privateKey);
  return {
    publicKey: fromBytes(publicKey, "hex"),
    privateKey: fromBytes(privateKey, "hex"),
  };
}
