import { ApiKeyMetadata, CoreServiceConfig } from "../api";
import { AuthorizationResult } from "./types";

export type ServiceAuthorizationPayload = { targetAddress?: string };

export function authorizeService(
  apikeyMetadata: ApiKeyMetadata,
  serviceConfig: CoreServiceConfig,
  authorizationPayload?: ServiceAuthorizationPayload,
): AuthorizationResult {
  const { services } = apikeyMetadata;
  // const { serviceTargetAddresses, serviceAction } = validations;

  // validate services
  const service = services.find(
    (srv) => srv.name === serviceConfig.serviceScope,
  );
  if (!service) {
    return {
      authorized: false,
      errorMessage: `The service "${serviceConfig.serviceScope}" is not authorized for this key.`,
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
        errorMessage: `The service "${serviceConfig.serviceScope}" action "${serviceConfig.serviceAction}" is not authorized for this key.`,
        errorCode: "SERVICE_ACTION_UNAUTHORIZED",
        status: 403,
      };
    }
  }

  // validate service target addresses
  // the service has to pass in the target address for this to be validated
  if (authorizationPayload?.targetAddress) {
    const isTargetAddressAllowed = service.targetAddresses.includes(
      authorizationPayload.targetAddress,
    );
    if (!isTargetAddressAllowed) {
      return {
        authorized: false,
        errorMessage: `The service "${serviceConfig.serviceScope}" target address "${authorizationPayload.targetAddress}" is not authorized for this key.`,
        errorCode: "SERVICE_TARGET_ADDRESS_UNAUTHORIZED",
        status: 403,
      };
    }
  }

  return {
    authorized: true,
    apiKeyMeta: apikeyMetadata,
  };
}
