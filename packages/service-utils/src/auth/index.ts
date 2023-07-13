import fetch from "isomorphic-unfetch";
import {
  ApiKey,
  ApiResponse,
  AuthorizationOptions,
  AuthorizationResponse,
  AuthorizationValidations,
  AuthorizeCFWorkerOptions,
  AuthorizeNodeServiceOptions,
} from "./types";

export async function authorizeCFWorkerService(
  options: AuthorizeCFWorkerOptions,
) {
  let cachedKey;

  if (!options.clientId) {
    return {
      authorized: false,
      errorMessage:
        "The client ID is missing. Make sure it is included with your Authorization Bearer request header.",
      errorCode: "MISSING_CLIENT_ID",
      statusCode: 422,
    };
  }

  // first, check if the key is in KV
  try {
    const kvKey = await options.kvStore.get(options.clientId);
    if (kvKey) {
      cachedKey = JSON.parse(kvKey) as ApiKey;
    }
  } catch (err) {
    // ignore JSON parse, assuming not valid
  }

  const origin = options.headers.get("Origin");
  let originHost = "";

  if (origin) {
    try {
      const originUrl = new URL(origin);
      originHost = originUrl.host;
    } catch (error) {
      // ignore, will be verified by domains
    }
  }

  const updateKv = async (keyData: ApiKey) => {
    options.kvStore.put(options.clientId, JSON.stringify(keyData), {
      expirationTtl: options.authOpts.cacheTtl || 60,
    });
  };

  return authorize(
    options.clientId,
    {
      ...options.authOpts,
      origin: originHost,
      cachedKey,
      onRefetchComplete: (keyData: ApiKey) => {
        options?.ctx?.waitUntil(updateKv(keyData));
      },
    },
    options.validations,
  );
}

export async function authorizeNodeService(
  options: AuthorizeNodeServiceOptions,
) {
  if (!options.clientId) {
    return {
      authorized: false,
      errorMessage:
        "The client ID is missing. Make sure it is included with your Authorization Bearer request header.",
      errorCode: "MISSING_CLIENT_ID",
      statusCode: 422,
    };
  }

  const origin =
    typeof options.headers["Origin"] === "string"
      ? options.headers["Origin"]
      : options.headers["Origin"]?.join("");

  let originHost = "";

  if (origin) {
    try {
      const originUrl = new URL(origin);
      originHost = originUrl.hostname;
    } catch (error) {
      // ignore, will be verified by domains
    }
  }

  return authorize(
    options.clientId,
    {
      ...options.authOpts,
      origin: originHost,
    },
    options.validations,
  );
}

/**
 * Authorizes a request for a given client ID
 *
 * @param clientId The String client id
 * @params authOpts The AuthorizationOptions
 * @params validations The AuthorizationValidations
 *
 * @returns The Promise AuthorizationResponse
 */
async function authorize(
  clientId: string,
  authOpts: AuthorizationOptions,
  validations?: AuthorizationValidations,
): Promise<AuthorizationResponse> {
  try {
    const { apiUrl, origin, scope, cachedKey, onRefetchComplete } = authOpts;

    let keyData = cachedKey;

    // no cached key, re-fetch from API
    if (!keyData) {
      const response = await fetch(
        `${apiUrl}/v1/keys/use/?scope=${scope}&clientId=${clientId}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "x-service-api-key": authOpts.serviceApiKey,
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

    // FIXME: validate bundleIds

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
