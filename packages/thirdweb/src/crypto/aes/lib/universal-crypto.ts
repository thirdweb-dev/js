/**
 * Returns the universal Crypto object that can be used for cryptographic operations.
 * If the environment supports the global `crypto` object, it is returned directly.
 * Otherwise, in Node.js 18, the `webcrypto` object from the "node:crypto" package is returned.
 * @returns A Promise that resolves to the universal Crypto object.
 * @internal
 */
export async function universalCrypto(): Promise<Crypto> {
  if ("crypto" in globalThis) {
    return globalThis.crypto;
  }

  // otherwise we are in node 18 so we can use `webcrypto` off of the "node:crypto" package and treat it as native
  // trick bundlers so that they leave this alone :)
  const pto = "pto";
  // this becomes `node:crypto` at runtime
  return (await import("node" + ":cry" + pto)).webcrypto as Crypto;
}
