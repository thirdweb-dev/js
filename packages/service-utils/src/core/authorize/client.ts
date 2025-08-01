import type { TeamAndProjectResponse } from "../api.js";
import type { AuthorizationResult } from "./types.js";

export type ClientAuthorizationPayload = {
  secretKeyHash: string | null;
  bundleId: string | null;
  origin: string | null;
  incomingServiceApiKey: string | null;
};

export function authorizeClient(
  authOptions: ClientAuthorizationPayload,
  teamAndProjectResponse: TeamAndProjectResponse,
): AuthorizationResult {
  const { origin, bundleId, incomingServiceApiKey } = authOptions;
  const { team, project, authMethod } = teamAndProjectResponse;

  const authResult: AuthorizationResult = {
    authMethod,
    authorized: true,
    project,
    team,
  };

  if (authMethod === "jwt") {
    // ignore domains and bundleIds for JWT auth, if the token is valid we'll return the authResult
    return authResult;
  }

  // if there's no project, we'll return the authResult (JWT or teamId auth)
  if (!project) {
    return authResult;
  }

  if (authMethod === "secretKey") {
    // if the auth was done using secretKey, we do not want to enforce domains or bundleIds
    return authResult;
  }

  if (authMethod === "publishableKey" && incomingServiceApiKey) {
    // if the auth was done using a combination of publishableKey and incomingServiceKey,
    // we will treat this the same as a secret key auth (relying on the upstream service to have already validated the publishableKey)
    return authResult;
  }

  // check for public restrictions
  if (project.domains.includes("*")) {
    return authResult;
  }

  // validate domains
  if (origin) {
    if (
      authorizeDomain({
        domains: project.domains,
        origin,
      })
    ) {
      return authResult;
    }

    return {
      authorized: false,
      errorCode: "ORIGIN_UNAUTHORIZED",
      errorMessage: `Invalid request: Unauthorized domain: ${origin}. You can view the restrictions for this project at https://thirdweb.com/${team.slug}/${project.slug}/settings`,
      status: 401,
    };
  }

  // validate bundleId
  if (bundleId) {
    if (
      authorizeBundleId({
        bundleId,
        bundleIds: project.bundleIds,
      })
    ) {
      return authResult;
    }

    return {
      authorized: false,
      errorCode: "BUNDLE_UNAUTHORIZED",
      errorMessage: `Invalid request: Unauthorized Bundle ID: ${bundleId}. You can view the restrictions for this project at https://thirdweb.com/${team.slug}/${project.slug}/settings`,
      status: 401,
    };
  }

  return {
    authorized: false,
    errorCode: "UNAUTHORIZED",
    errorMessage:
      "The keys are invalid. Please check the secret-key/clientId and try again.",
    status: 401,
  };
}

// Exposed for use in validating ecosystem partners settings
export function authorizeDomain({
  domains,
  origin,
}: {
  domains: string[];
  origin: string;
}): boolean {
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
}: {
  bundleIds: string[];
  bundleId: string;
}): boolean {
  // find matching bundle id, or if all bundles allowed
  return !!bundleIds.find((b) => {
    if (b === "*") {
      return true;
    }

    return b === bundleId;
  });
}
