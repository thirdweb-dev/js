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
      authorizeDomain({
        domains,
        origin,
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
      authorizeBundleId({
        bundleIds,
        bundleId,
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

// Exposed for use in validating ecosystem partners settings
export function authorizeDomain({
  domains,
  origin,
}: { domains: string[]; origin: string }): boolean {
  // find matching domain, or if all domains allowed
  // embedded-wallet.thirdweb(-dev).com is automatically allowed
  // because the rpc is passed from user's domain to embedded-wallet.thirdweb.com iframe for use.
  // Note this doesn't allow embedded-wallets from being used if it's disabled. The service check that runs after enforces that.
  return !![
    ...domains,
    "embedded-wallet.thirdweb.com",
    "embedded-wallet.thirdweb-dev.com",
  ].find((d) => {
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
  });
}

export function authorizeBundleId({
  bundleIds,
  bundleId,
}: { bundleIds: string[]; bundleId: string }): boolean {
  // find matching bundle id, or if all bundles allowed
  return !!bundleIds.find((b) => {
    if (b === "*") {
      return true;
    }

    return b === bundleId;
  });
}
