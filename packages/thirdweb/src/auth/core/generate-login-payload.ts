import {
  DEFAULT_LOGIN_PAYLOAD_EXPIRATION,
  DEFAULT_LOGIN_STATEMENT,
  DEFAULT_LOGIN_VERSION,
} from "./constants.js";
import type { AuthOptions, LoginPayload } from "./types.js";

export type GenerateLoginPayloadParams = {
  address: string;
  chainId?: number;
};

/**
 * Generates a login payload based on the provided options.
 * @param options - The authentication options.
 * @returns A function that accepts login payload parameters and returns a promise that resolves to a login payload.
 * @internal
 */
export function generateLoginPayload(options: AuthOptions) {
  return async ({
    address,
    chainId,
  }: GenerateLoginPayloadParams): Promise<LoginPayload> => {
    const now = Date.now();
    const expirationTime =
      (options.login?.payloadExpirationTimeSeconds ||
        DEFAULT_LOGIN_PAYLOAD_EXPIRATION) * 1000;
    return {
      address,
      chain_id: chainId ? chainId.toString() : undefined,
      domain: options.domain,
      expiration_time: new Date(now + expirationTime).toISOString(),
      invalid_before: new Date(now - expirationTime).toISOString(),
      issued_at: new Date(now).toISOString(),
      // use the user passed nonce generator or fall back to generationg uuid
      nonce: await (
        options.login?.nonce?.generate ||
        (() =>
          import("../../utils/random.js").then(({ randomBytesHex }) =>
            randomBytesHex(),
          ))
      )(),
      statement: options.login?.statement || DEFAULT_LOGIN_STATEMENT,
      version: options.login?.version || DEFAULT_LOGIN_VERSION,
      resources: options.login?.resources,
      uri: options.login?.uri,
    };
  };
}
