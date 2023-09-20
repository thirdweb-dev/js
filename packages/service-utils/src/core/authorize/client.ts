import type { ApiKeyMetadata } from "../api";
import type { AuthorizationResult } from "./types";

export type ClientAuthorizationPayload = {
  secretKeyHash: string | null;
  bundleId: string | null;
  origin: string | null;
};

export function authorizeClient(
  authOptions: ClientAuthorizationPayload,
  apiKeyMeta: ApiKeyMetadata,
): AuthorizationResult {
  const { origin, bundleId, secretKeyHash: providedSecretHash } = authOptions;
  const { domains, bundleIds, secretHash } = apiKeyMeta;

  const authResult: AuthorizationResult = {
    authorized: true,
    apiKeyMeta,
    accountMeta: {
      id: apiKeyMeta.accountId,
      // TODO update this later
      name: "",
      creatorWalletAddress: apiKeyMeta.creatorWalletAddress,
      limits: apiKeyMeta.limits,
      rateLimits: apiKeyMeta.rateLimits,
      usage: apiKeyMeta.usage,
    },
  };

  // check for public restrictions
  if (domains.includes("*")) {
    return authResult;
  }

  // check for secretHash
  if (providedSecretHash) {
    if (secretHash !== providedSecretHash) {
      return {
        authorized: false,
        errorMessage:
          "Incorrect key provided. You can view your active API keys at https://thirdweb.com/dashboard/settings",
        errorCode: "SECRET_INVALID",
        status: 401,
      };
    }

    return authResult;
  }

  // validate domains
  if (origin) {
    if (
      // find matching domain, or if all domains allowed
      domains.find((d) => {
        // if any domain is allowed, we'll return true
        if (d === "*") {
          return true;
        }

        // special rule for `localhost`
        // if the domain is localhost, we'll allow any origin that starts with localhost
        if (d === "localhost" && origin.startsWith("localhost")) {
          return true;
        }

        // If the allowedDomain has a wildcard,
        // we'll check that the ending of our domain matches the wildcard
        if (d.startsWith("*.")) {
          // get rid of the * and check if it ends with the `.<domain>.<tld>`
          const domainRoot = d.slice(1);
          return origin.endsWith(domainRoot);
        }

        // If there's no wildcard, we'll check for an exact match
        return d === origin;
      })
    ) {
      return authResult;
    }

    return {
      authorized: false,
      errorMessage: `Invalid request: Unauthorized domain: ${origin}. You can view the restrictions on this API key at https://thirdweb.com/create-api-key`,
      errorCode: "ORIGIN_UNAUTHORIZED",
      status: 401,
    };
  }

  // validate bundleId
  if (bundleId) {
    if (
      // find matching bundle id, or if all bundles allowed
      bundleIds.find((b) => {
        if (b === "*") {
          return true;
        }

        return b === bundleId;
      })
    ) {
      return authResult;
    }

    return {
      authorized: false,
      errorMessage: `Invalid request: Unauthorized Bundle ID: ${bundleId}. You can view the restrictions on this API key at https://thirdweb.com/create-api-key`,
      errorCode: "BUNDLE_UNAUTHORIZED",
      status: 401,
    };
  }

  return {
    authorized: false,
    errorMessage:
      "The keys are invalid. Please check the secret-key/clientId and try again.",
    errorCode: "UNAUTHORIZED",
    status: 401,
  };
}
