import { trackLogin } from "../../analytics/track/siwe.js";
import { getCachedChain } from "../../chains/utils.js";
import { verifySignature } from "../verify-signature.js";
import { DEFAULT_LOGIN_STATEMENT, DEFAULT_LOGIN_VERSION } from "./constants.js";
import { createLoginMessage } from "./create-login-message.js";
import type { AuthOptions, LoginPayload } from "./types.js";

/**
 * @auth
 */
export type VerifyLoginPayloadParams = {
  payload: LoginPayload;
  signature: string;
};

// we use this symbol to tag the payload as verified so that developers don't accidentally pass an unverified payload to other functions
const VERIFIED_SYMBOL = /* @__PURE__ */ Symbol("verified_login_payload");

/**
 * @auth
 */
export type VerifiedLoginPayload = LoginPayload & {
  [VERIFIED_SYMBOL]: true;
};

/**
 * @auth
 */
export type VerifyLoginPayloadResult =
  | {
      valid: true;
      payload: VerifiedLoginPayload;
    }
  | {
      valid: false;
      error: string;
    };

/**
 * Verifies the login payload by checking various properties and signatures.
 * @param options - The authentication options.
 * @returns A function that accepts the login payload and signature, and performs the verification.
 * @internal
 */
export function verifyLoginPayload(options: AuthOptions) {
  const verifyLoginPayloadFn = async ({
    payload,
    signature,
  }: VerifyLoginPayloadParams): Promise<VerifyLoginPayloadResult> => {
    // check that the intended domain matches the domain of the payload
    if (payload.domain !== options.domain) {
      return {
        error: `Expected domain '${options.domain}' does not match domain on payload '${payload.domain}'`,
        valid: false,
      };
    }

    const statement = options.login?.statement || DEFAULT_LOGIN_STATEMENT;
    // check that the payload statement matches the expected statement
    if (statement !== payload.statement) {
      return {
        error: `Expected statement '${statement}' does not match statement on payload '${payload.statement}'`,
        valid: false,
      };
    }

    // compare uri if it is defined
    if (options.login?.uri && options.login.uri !== payload.uri) {
      return {
        error: `Expected uri '${options.login.uri}' does not match uri on payload '${payload.uri}'`,
        valid: false,
      };
    }

    const version = options.login?.version || DEFAULT_LOGIN_VERSION;
    if (version !== payload.version) {
      return {
        error: `Expected version '${version}' does not match version on payload '${payload.version}'`,
        valid: false,
      };
    }

    // check that the payload nonce is valid if a nonce validator is provided
    if (options.login?.nonce?.validate) {
      try {
        const isValid = await options.login.nonce.validate(payload.nonce);
        if (!isValid) {
          return {
            error: `Invalid nonce '${payload.nonce}'`,
            valid: false,
          };
        }
      } catch {
        return {
          error: `Vailed to validate nonce '${payload.nonce}'`,
          valid: false,
        };
      }
    }

    const currentDate = new Date();

    if (currentDate < new Date(payload.invalid_before)) {
      return {
        error: "Payload is not yet valid",
        valid: false,
      };
    }

    if (currentDate > new Date(payload.expiration_time)) {
      return {
        error: "Payload has expired",
        valid: false,
      };
    }

    if (options.login?.resources?.length) {
      const missingResources = options.login.resources.filter(
        (resource) => !payload.resources?.includes(resource),
      );
      if (missingResources.length > 0) {
        return {
          error: `Login request is missing required resources: ${missingResources.join(
            ", ",
          )}`,
          valid: false,
        };
      }
    }

    // this is the message the user should have signed (resulting in the singature passd)
    const computedMessage = createLoginMessage(payload);

    const signatureIsValid = await verifySignature({
      address: payload.address,
      chain: payload.chain_id
        ? getCachedChain(Number.parseInt(payload.chain_id))
        : undefined,
      client: options.client,
      message: computedMessage,
      signature: signature,
    });

    if (!signatureIsValid) {
      return {
        error: "Invalid signature",
        valid: false,
      };
    }

    return {
      payload: { ...payload, [VERIFIED_SYMBOL]: true },
      valid: true,
    };
  };

  return async ({
    payload,
    signature,
  }: VerifyLoginPayloadParams): Promise<VerifyLoginPayloadResult> => {
    const result = await verifyLoginPayloadFn({ payload, signature });

    // We can only track logins if the client is provided
    if (options.client) {
      trackLogin({
        chainId: payload.chain_id
          ? Number.parseInt(payload.chain_id)
          : undefined,
        client: options.client,
        error: !result.valid
          ? { code: "401", message: result.error }
          : undefined,
        walletAddress: payload.address,
      });
    }

    return result;
  };
}
