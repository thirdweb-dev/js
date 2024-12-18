import type { CoreServiceConfig, TeamAndProjectResponse } from "../api.js";
import type { AuthorizationResult } from "./types.js";

export function authorizeService(
  teamAndProjectResponse: TeamAndProjectResponse,
  serviceConfig: CoreServiceConfig,
): AuthorizationResult {
  const { team, project, authMethod } = teamAndProjectResponse;

  if (serviceConfig.serviceScope === null) {
    // if explicitly set to null, we do not want to check for service level authorization
    return {
      authorized: true,
      team,
      authMethod,
    };
  }

  if (!team.enabledScopes.includes(serviceConfig.serviceScope)) {
    return {
      authorized: false,
      errorMessage: `Invalid request: Unauthorized service: ${serviceConfig.serviceScope}. You can view the restrictions for this team in your dashboard: https://thirdweb.com`,
      errorCode: "SERVICE_UNAUTHORIZED",
      status: 403,
    };
  }

  if (!project) {
    // acting on behalf of the team (ie. coming from dashboard), authorize
    return {
      authorized: true,
      team,
      authMethod,
    };
  }

  // validate services
  const services = project.services;
  const service = services.find(
    (srv) => srv.name === serviceConfig.serviceScope,
  );
  if (!service) {
    return {
      authorized: false,
      errorMessage: `Invalid request: Unauthorized service: ${serviceConfig.serviceScope}. You can view the restrictions on this project in your dashboard: https://thirdweb.com`,
      errorCode: "SERVICE_UNAUTHORIZED",
      status: 403,
    };
  }

  // validate service actions
  if (serviceConfig.serviceAction) {
    const isActionAllowed = (service.actions as string[]).includes(
      serviceConfig.serviceAction,
    );
    if (!isActionAllowed) {
      return {
        authorized: false,
        errorMessage: `Invalid request: Unauthorized action: ${serviceConfig.serviceScope} ${serviceConfig.serviceAction}. You can view the restrictions on this API key in your dashboard:  https://thirdweb.com/create-api-key`,
        errorCode: "SERVICE_ACTION_UNAUTHORIZED",
        status: 403,
      };
    }
  }

  return {
    authorized: true,
    team,
    project,
    authMethod,
  };
}
