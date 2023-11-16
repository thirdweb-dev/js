export async function universalCrypto(): Promise<Crypto> {
  if ("crypto" in globalThis) {
    return globalThis.crypto;
  }

  // otherwise we are in node 18 so we can use `webcrypto` off of the "node:crypto" package and treat it as native
  // trick bundlers so that they leave this alone :)
  const pto = "pto";
  const nodeCryptoNameSpace = "node:" + "cry" + pto;
  return (await import(nodeCryptoNameSpace)).webcrypto as Crypto;
}
