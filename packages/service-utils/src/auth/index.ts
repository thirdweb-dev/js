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

export async function authorizeCFWorkerService(
  options: AuthorizeCFWorkerOptions,
) {
  const { kvStore, ctx, authOptions, serviceConfig, validations } = options;
  const { clientId } = authOptions;

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
    authOptions,
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

  return authorize({
    authOptions,
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
  authOptions: AuthOptions;
  serviceConfig: ServiceConfiguration;
  validations: AuthorizationValidations;
}): Promise<AuthorizationResponse> {
  try {
    const { authOptions, serviceConfig, validations } = options;
    const { clientId } = authOptions;
    const { apiUrl, scope, serviceKey, cachedKey, onRefetchComplete } =
      serviceConfig;

    let keyData = cachedKey;

    // no cached key, re-fetch from API
    if (!keyData) {
      const response = await fetch(
        `${apiUrl}/v1/keys/use?scope=${scope}&clientId=${clientId}`,
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
    const authResponse = authAccess(authOptions, keyData);

    if (!authResponse?.authorized) {
      return authResponse;
    }

    const authzResponse = authzServices(validations, keyData, scope);

    if (!authzResponse?.authorized) {
      return authzResponse;
    }
    // FIXME: validate bundleId

    return {
      authorized: true,
      data: keyData,
    };
  } catch (err) {
    console.error("Failed to authorize this key.", err);

    return {
      authorized: false,
      errorMessage: "Internal error",
      errorCode: "INTERNAL_ERROR",
      statusCode: 500,
    };
  }
}

function authAccess(authOptions: AuthOptions, apiKey: ApiKey) {
  const { origin, secretHash: providedSecretHash } = authOptions;
  const { domains, secretHash } = apiKey;

  if (providedSecretHash) {
    if (secretHash !== providedSecretHash) {
      return {
        authorized: false,
        errorMessage: "The secret is invalid.",
        errorCode: "SECRET_INVALID",
        statusCode: 401,
      };
    }
    return {
      authorized: true,
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
      };
    }

    return {
      authorized: false,
      errorMessage: "The origin is not authorized for this key.",
      errorCode: "ORIGIN_UNAUTHORIZED",
      statusCode: 401,
    };
  }

  // FIXME: validate bundle id
  return {
    authorized: false,
    errorMessage: "The keys are invalid.",
    errorCode: "UNAUTHORIZED",
    statusCode: 401,
  };
}

function authzServices(
  validations: AuthorizationValidations,
  apiKey: ApiKey,
  scope: string,
) {
  const { services } = apiKey;
  const { serviceTargetAddresses, serviceAction } = validations;

  // validate services
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
  if (serviceAction) {
    if (!service.actions.includes(serviceAction)) {
      return {
        authorized: false,
        errorMessage: `The service "${scope}" action "${serviceAction}" is not authorized for this key.`,
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

  return {
    authorized: true,
  };
}
