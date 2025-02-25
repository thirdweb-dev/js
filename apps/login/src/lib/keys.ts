import "server-only";

import { type CryptoKey, importPKCS8, importSPKI } from "jose";

const ALGORITHM = "RS256";

let privateKeyPromise: Promise<CryptoKey> | null = null;
let publicKeyPromise: Promise<CryptoKey> | null = null;

export async function getKeyInfo() {
  // Ensure these are loaded only once and cached
  if (!privateKeyPromise) {
    // biome-ignore lint/style/noNonNullAssertion: if this is not set the server will crash
    privateKeyPromise = importPKCS8(process.env.RSA_PRIVATE_KEY!, ALGORITHM);
  }
  if (!publicKeyPromise) {
    // biome-ignore lint/style/noNonNullAssertion: if this is not set the server will crash
    publicKeyPromise = importSPKI(process.env.RSA_PUBLIC_KEY!, ALGORITHM);
  }

  // Wait for both imports to resolve
  const [privateKey, publicKey] = await Promise.all([
    privateKeyPromise,
    publicKeyPromise,
  ]);

  return {
    privateKey,
    publicKey,
    // biome-ignore lint/style/noNonNullAssertion: if this is not set the server will crash
    kid: process.env.RSA_KEY_ID!,
    alg: ALGORITHM,
  };
}
