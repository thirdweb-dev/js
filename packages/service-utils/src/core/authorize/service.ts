import { ApiKeyMetadata, CoreServiceConfig } from "../api";
import { AuthorizationResult } from "./types";

export type ServiceAuthorizationPayload = { targetAddress?: string | string[] };

export function authorizeService(
  apiKeyMetadata: ApiKeyMetadata,
  serviceConfig: CoreServiceConfig,
  authorizationPayload?: ServiceAuthorizationPayload,
): AuthorizationResult {
  const { services } = apiKeyMetadata;
  // validate services
  const service = services.find(
    (srv) => srv.name === serviceConfig.serviceScope,
  );
  if (!service) {
    return {
      authorized: false,
      errorMessage: `The service "${serviceConfig.serviceScope}" is not authorized for this key. Please update your key permissions on the Thirdweb Dashboard.`,
      errorCode: "SERVICE_UNAUTHORIZED",
      status: 403,
    };
  }

  // validate service actions
  if (serviceConfig.serviceAction) {
    const isActionAllowed = service.actions.includes(
      serviceConfig.serviceAction,
    );
    if (!isActionAllowed) {
      return {
        authorized: false,
        errorMessage: `The service "${serviceConfig.serviceScope}" action "${serviceConfig.serviceAction}" is not authorized for this key. Please update your key permissions on the Thirdweb Dashboard.`,
        errorCode: "SERVICE_ACTION_UNAUTHORIZED",
        status: 403,
      };
    }
  }

  // validate service target addresses
  // the service has to pass in the target address for this to be validated
  if (authorizationPayload?.targetAddress) {
    const checkedAddresses = Array.isArray(authorizationPayload.targetAddress)
      ? authorizationPayload.targetAddress
      : [authorizationPayload.targetAddress];

    const allAllowed = service.targetAddresses.includes("*");

    if (
      !allAllowed &&
      checkedAddresses.some((ta) => !service.targetAddresses.includes(ta))
    ) {
      return {
        authorized: false,
        errorMessage: `The target address ${checkedAddresses} for service "${serviceConfig.serviceScope}" is not authorized for this key. Please update your key permissions on the Thirdweb Dashboard.`,
        errorCode: "SERVICE_TARGET_ADDRESS_UNAUTHORIZED",
        status: 403,
      };
    }
  }

  return {
    authorized: true,
    apiKeyMeta: apiKeyMetadata,
  };
}
