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

  // check for secretHash
  if (providedSecretHash) {
    if (secretHash !== providedSecretHash) {
      return {
        authorized: false,
        errorMessage: "The secret is invalid. Please check you secret-key",
        errorCode: "SECRET_INVALID",
        status: 401,
      };
    }
    return {
      authorized: true,
      apiKeyMeta,
      accountMeta: {
        id: apiKeyMeta.accountId,
        // TODO update this later
        name: "",
        creatorWalletAddress: apiKeyMeta.creatorWalletAddress,
      },
    };
  }

  // check for public restrictions
  if (domains.includes("*")) {
    return {
      authorized: true,
      apiKeyMeta,
    };
  }

  // validate domains
  if (origin) {
    if (
      // find matching domain, or if all domains allowed
      domains.find((d) => {
        if (d === "*") {
          return true;
        }

        // If the allowedDomain has a wildcard,
        // we'll check that the ending of our domain matches the wildcard
        if (d.startsWith("*.")) {
          const domainRoot = d.slice(2);
          return origin.endsWith(domainRoot);
        }

        // If there's no wildcard, we'll check for an exact match
        return d === origin;
      })
    ) {
      return {
        authorized: true,
        apiKeyMeta,
        accountMeta: {
          id: apiKeyMeta.accountId,
          // TODO update this later
          name: "",
          creatorWalletAddress: apiKeyMeta.creatorWalletAddress,
        },
      };
    }

    return {
      authorized: false,
      errorMessage: `The domain: ${origin}, is not authorized for this key. Please update your key permissions on the thirdweb dashboard`,
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
      return {
        authorized: true,
        apiKeyMeta,
        accountMeta: {
          id: apiKeyMeta.accountId,
          // TODO update this later
          name: "",
          creatorWalletAddress: apiKeyMeta.creatorWalletAddress,
        },
      };
    }

    return {
      authorized: false,
      errorMessage: `The bundleId: ${bundleId}, is not authorized for this key. Please update your key permissions on the thirdweb dashboard`,
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
