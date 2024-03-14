import { defineChain } from "../../chains/utils.js";
import { verifySignature } from "../verifySignature.js";
import { DEFAULT_LOGIN_STATEMENT, DEFAULT_LOGIN_VERSION } from "./constants.js";
import { createLoginMessage } from "./create-login-message.js";
import type { AuthOptions, LoginPayload } from "./types.js";

export type VerifyLoginPayloadParams = {
  payload: LoginPayload;
  signature: string;
};

/**
 * Verifies the login payload by checking various properties and signatures.
 * @param options - The authentication options.
 * @returns A function that accepts the login payload and signature, and performs the verification.
 * @throws Throws an error if the verification fails.
 * @example TODO
 */
export function verifyLoginPayload(options: AuthOptions) {
  return async function ({ payload, signature }: VerifyLoginPayloadParams) {
    // check that the intended domain matches the domain of the payload
    if (payload.domain !== options.domain) {
      throw new Error(
        `Expected domain '${options.domain}' does not match domain on payload '${payload.domain}'`,
      );
    }

    const statement = options.login?.statement || DEFAULT_LOGIN_STATEMENT;
    // check that the payload statement matches the expected statement
    if (statement !== payload.statement) {
      throw new Error(
        `Expected statement '${statement}' does not match statement on payload '${payload.statement}'`,
      );
    }

    // compare uri if it is defined
    if (options.login?.uri && options.login.uri !== payload.uri) {
      throw new Error(
        `Expected uri '${options.login.uri}' does not match uri on payload '${payload.uri}'`,
      );
    }

    const version = options.login?.version || DEFAULT_LOGIN_VERSION;
    if (version !== payload.version) {
      throw new Error(
        `Expected version '${version}' does not match version on payload '${payload.version}'`,
      );
    }

    // check that the payload nonce is valid if a nonce validator is provided
    if (options.login?.nonce?.validate) {
      try {
        const isValid = await options.login.nonce.validate(payload.nonce);
        if (!isValid) {
          throw new Error(`Invalid nonce '${payload.nonce}'`);
        }
      } catch {
        throw new Error(`Invalid nonce '${payload.nonce}'`);
      }
    }

    const currentDate = new Date();

    if (currentDate < new Date(payload.invalid_before)) {
      throw new Error(`Payload is not yet valid`);
    }

    if (currentDate > new Date(payload.expiration_time)) {
      throw new Error(`Payload has expired`);
    }

    if (options.login?.resources?.length) {
      const missingResources = options.login.resources.filter(
        (resource) => !payload.resources?.includes(resource),
      );
      if (missingResources.length > 0) {
        throw new Error(
          `Login request is missing required resources: ${missingResources.join(
            ", ",
          )}`,
        );
      }
    }

    // this is the message the user should have signed (resulting in the singature passd)
    const computedMessage = createLoginMessage(payload);

    const signatureIsValid = await verifySignature({
      message: computedMessage,
      signature: signature,
      address: payload.address,
      chain: payload.chain_id
        ? defineChain(parseInt(payload.chain_id))
        : undefined,
      client: options.client,
    });

    if (!signatureIsValid) {
      return {
        valid: false,
      };
    }

    return {
      valid: true,
      verifiedAddress: payload.address,
    };
  };
}
