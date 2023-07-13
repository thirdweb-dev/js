import fetch from "isomorphic-unfetch";
import {
  ApiKey,
  ApiResponse,
  ServiceConfiguration,
  AuthorizationResponse,
  AuthorizationValidations,
  AuthorizeCFWorkerOptions,
  AuthorizeNodeServiceOptions,
  AuthOptions,
} from "./types";
import { validateAuthOptions } from "./utils";

export async function authorizeCFWorkerService(
  options: AuthorizeCFWorkerOptions,
) {
  const { kvStore, ctx, authOptions, serviceConfig, validations } = options;
  const { clientId, bundleId, origin } = authOptions;

  const validationResponse = validateAuthOptions(authOptions);

  if (!validationResponse.authorized) {
    return validationResponse;
  }

  let cachedKey;

  // first, check if the key is in KV
  try {
    const kvKey = await kvStore.get(clientId);
    if (kvKey) {
      cachedKey = JSON.parse(kvKey) as ApiKey;
    }
  } catch (err) {
    // ignore JSON parse, assuming not valid
  }

  const updateKv = async (keyData: ApiKey) => {
    kvStore.put(clientId as string, JSON.stringify(keyData), {
      expirationTtl: serviceConfig.cacheTtl || 60,
    });
  };

  return authorize({
    authOpts: {
      clientId,
      bundleId,
      origin,
    },
    serviceConfig: {
      ...serviceConfig,
      cachedKey,
      onRefetchComplete: (keyData: ApiKey) => {
        ctx.waitUntil(updateKv(keyData));
      },
    },
    validations,
  });
}

export async function authorizeNodeService(
  options: AuthorizeNodeServiceOptions,
) {
  const { authOptions, serviceConfig, validations } = options;
  const { clientId, bundleId, origin } = authOptions;

  const validationResponse = validateAuthOptions(authOptions);

  if (!validationResponse.authorized) {
    return validationResponse;
  }

  return authorize({
    authOpts: {
      clientId,
      bundleId,
      origin,
    },
    serviceConfig,
    validations,
  });
}

/**
 * Authorizes a request for a given client ID
 *
 * @returns The Promise AuthorizationResponse
 */
async function authorize(options: {
  authOpts: AuthOptions;
  serviceConfig: ServiceConfiguration;
  validations?: AuthorizationValidations;
}): Promise<AuthorizationResponse> {
  try {
    const { authOpts, serviceConfig, validations } = options;
    const { clientId, origin } = authOpts;
    const { apiUrl, scope, serviceKey, cachedKey, onRefetchComplete } =
      serviceConfig;

    let keyData = cachedKey;

    // no cached key, re-fetch from API
    if (!keyData) {
      const response = await fetch(
        `${apiUrl}/v1/keys/use/?scope=${scope}&clientId=${clientId}`,
        {
          method: "GET",
          headers: {
            "x-service-api-key": serviceKey,
            "content-type": "application/json",
          },
        },
      );

      const apiResponse = (await response.json()) as ApiResponse;

      if (!response.ok) {
        const { error } = apiResponse;

        return {
          authorized: false,
          errorMessage: error.message,
          errorCode: error.code || "",
          statusCode: error.statusCode || 401,
        };
      }

      keyData = apiResponse.data as ApiKey;

      if (onRefetchComplete) {
        onRefetchComplete(keyData);
      }
    }

    //
    // Run validations
    //
    const { domains, services } = keyData;
    const { serviceActions, serviceTargetAddresses } = validations || {};

    // validate domains
    if (origin && domains.length > 0) {
      if (
        // find matching domain, or if all domains allowed
        !domains.find((d) => {
          if (d === "*") {
            return true;
          }

          // If the allowedDomain has a wildcard,
          // we'll check that the ending of our domain matches the wildcard
          if (d.startsWith("*.")) {
            const wildcard = d.slice(2);
            return origin.endsWith(wildcard);
          }

          // If there's no wildcard, we'll check for an exact match
          return d === origin;
        })
      ) {
        return {
          authorized: false,
          errorMessage: "The domain is not authorized for this key.",
          errorCode: "DOMAIN_UNAUTHORIZED",
          statusCode: 403,
        };
      }
    }

    // validate services
    if (services.length > 0) {
      const service = services.find((srv) => srv.name === scope);
      if (!service) {
        return {
          authorized: false,
          errorMessage: `The service "${scope}" is not authorized for this key.`,
          errorCode: "SERVICE_UNAUTHORIZED",
          statusCode: 403,
        };
      }

      // validate service actions
      if (serviceActions) {
        let unknownAction;

        serviceActions.forEach((action) => {
          if (!service.actions.includes(action)) {
            unknownAction = action;
          }
        });

        if (unknownAction) {
          return {
            authorized: false,
            errorMessage: `The service "${scope}" action "${unknownAction}" is not authorized for this key.`,
            errorCode: "SERVICE_ACTION_UNAUTHORIZED",
            statusCode: 403,
          };
        }
      }

      // validate service target addresses
      if (
        serviceTargetAddresses &&
        !service.targetAddresses.find(
          (addr) => addr === "*" || serviceTargetAddresses.includes(addr),
        )
      ) {
        return {
          authorized: false,
          errorMessage: `The service "${scope}" target address is not authorized for this key.`,
          errorCode: "SERVICE_TARGET_ADDRESS_UNAUTHORIZED",
          statusCode: 403,
        };
      }
    }

    // FIXME: validate bundleId

    return {
      authorized: true,
      data: keyData,
    };
  } catch (err) {
    console.error("Failed to authorize this key", err);

    return {
      authorized: false,
      errorMessage: "Internal error",
      errorCode: "INTERNAL_ERROR",
      statusCode: 500,
    };
  }
}
