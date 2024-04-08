import type { LoginPayload } from "./types.js";

/**
 * Create an EIP-4361 & CAIP-122 compliant message to sign based on the login payload
 * @param payload - The login payload containing the necessary information.
 * @returns The generated login message.
 * @internal
 */
export function createLoginMessage(payload: LoginPayload): string {
  const typeField = "Ethereum";
  const header = `${payload.domain} wants you to sign in with your ${typeField} account:`;
  let prefix = [header, payload.address].join("\n");
  prefix = [prefix, payload.statement].join("\n\n");
  if (payload.statement) {
    prefix += "\n";
  }

  const suffixArray = [];
  if (payload.uri) {
    const uriField = `URI: ${payload.uri}`;
    suffixArray.push(uriField);
  }

  const versionField = `Version: ${payload.version}`;
  suffixArray.push(versionField);

  if (payload.chain_id) {
    const chainField = `Chain ID: ${payload.chain_id}` || "1";
    suffixArray.push(chainField);
  }

  const nonceField = `Nonce: ${payload.nonce}`;
  suffixArray.push(nonceField);

  const issuedAtField = `Issued At: ${payload.issued_at}`;
  suffixArray.push(issuedAtField);

  const expiryField = `Expiration Time: ${payload.expiration_time}`;
  suffixArray.push(expiryField);

  if (payload.invalid_before) {
    const invalidBeforeField = `Not Before: ${payload.invalid_before}`;
    suffixArray.push(invalidBeforeField);
  }

  if (payload.resources) {
    suffixArray.push(
      ["Resources:", ...payload.resources.map((x) => `- ${x}`)].join("\n"),
    );
  }

  const suffix = suffixArray.join("\n");
  return [prefix, suffix].join("\n");
}
