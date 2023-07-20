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

  if (providedSecretHash) {
    if (secretHash !== providedSecretHash) {
      return {
        authorized: false,
        errorMessage: "The secret is invalid.",
        errorCode: "SECRET_INVALID",
        status: 401,
      };
    }
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
      };
    }

    return {
      authorized: false,
      errorMessage: "The origin is not authorized for this key.",
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
      };
    }

    return {
      authorized: false,
      errorMessage: "The bundle is not authorized for this key.",
      errorCode: "BUNDLE_UNAUTHORIZED",
      status: 401,
    };
  }

  return {
    authorized: false,
    errorMessage: "The keys are invalid.",
    errorCode: "UNAUTHORIZED",
    status: 401,
  };
}
