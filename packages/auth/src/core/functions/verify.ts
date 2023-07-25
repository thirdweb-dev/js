import { VerifyParams } from "../schema/functions";
import { VerifyOptionsSchema } from "../schema/verify";
import { createMessage } from "./message";

export async function verify({
  wallet,
  payload,
  options,
}: VerifyParams): Promise<string> {
  const parsedOptions = VerifyOptionsSchema.parse(options);

  if (payload.payload.type !== wallet.type) {
    throw new Error(
      `Expected chain type '${wallet.type}' does not match chain type on payload '${payload.payload.type}'`,
    );
  }

  // Check that the intended domain matches the domain of the payload
  if (payload.payload.domain !== parsedOptions.domain) {
    throw new Error(
      `Expected domain '${parsedOptions.domain}' does not match domain on payload '${payload.payload.domain}'`,
    );
  }

  // Check that the payload statement matches the expected statement
  if (parsedOptions?.statement) {
    if (payload.payload.statement !== parsedOptions.statement) {
      throw new Error(
        `Expected statement '${parsedOptions.statement}' does not match statement on payload '${payload.payload.statement}'`,
      );
    }
  }

  // Check that the intended URI matches the URI of the payload
  if (parsedOptions?.uri) {
    if (payload.payload.uri !== parsedOptions.uri) {
      throw new Error(
        `Expected URI '${parsedOptions.uri}' does not match URI on payload '${payload.payload.uri}'`,
      );
    }
  }

  // Check that the intended version matches the version of the payload
  if (parsedOptions?.version) {
    if (payload.payload.version !== parsedOptions.version) {
      throw new Error(
        `Expected version '${parsedOptions.version}' does not match version on payload '${payload.payload.version}'`,
      );
    }
  }

  // Check that the intended chain ID matches the chain ID of the payload
  if (parsedOptions?.chainId) {
    if (payload.payload.chain_id !== parsedOptions.chainId) {
      throw new Error(
        `Expected chain ID '${parsedOptions.chainId}' does not match chain ID on payload '${payload.payload.chain_id}'`,
      );
    }
  }

  // Check that the payload nonce is valid
  if (parsedOptions?.validateNonce !== undefined) {
    try {
      await parsedOptions.validateNonce(payload.payload.nonce);
    } catch (err) {
      throw new Error(`Login request nonce is invalid`);
    }
  }

  // Check that it isn't before the invalid before time
  const currentTime = new Date();
  if (currentTime < new Date(payload.payload.invalid_before)) {
    throw new Error(`Login request is not yet valid`);
  }

  // Check that the payload hasn't expired
  if (currentTime > new Date(payload.payload.expiration_time)) {
    throw new Error(`Login request has expired`);
  }

  // Check that the specified resources are present on the payload
  if (parsedOptions?.resources) {
    const missingResources = parsedOptions.resources.filter(
      (resource) => !payload.payload.resources?.includes(resource),
    );
    if (missingResources.length > 0) {
      throw new Error(
        `Login request is missing required resources: ${missingResources.join(
          ", ",
        )}`,
      );
    }
  }

  // Check that the signing address is the claimed wallet address
  const message = createMessage(payload.payload);
  const chainId =
    wallet.type === "evm" && payload.payload.chain_id
      ? parseInt(payload.payload.chain_id)
      : undefined;
  const verified = await wallet.verifySignature(
    message,
    payload.signature,
    payload.payload.address,
    chainId,
  );
  if (!verified) {
    throw new Error(
      `Signer address does not match payload address '${payload.payload.address.toLowerCase()}'`,
    );
  }

  return payload.payload.address;
}
