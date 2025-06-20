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
      authMethod,
      authorized: true,
      team,
    };
  }

  if (!team.enabledScopes.includes(serviceConfig.serviceScope)) {
    return {
      authorized: false,
      errorCode: "SERVICE_UNAUTHORIZED",
      errorMessage: `Invalid request: Unauthorized service: ${serviceConfig.serviceScope} for team: ${team.name} (${team.id}). You can view the restrictions for this team in your dashboard: https://thirdweb.com`,
      status: 403,
    };
  }

  if (!project) {
    // acting on behalf of the team (ie. coming from dashboard), authorize
    return {
      authMethod,
      authorized: true,
      team,
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
      errorCode: "SERVICE_UNAUTHORIZED",
      errorMessage: `Invalid request: Unauthorized service: ${serviceConfig.serviceScope} for project: ${project.name} (${project.publishableKey}). You can view the restrictions on this project in your dashboard: https://thirdweb.com`,
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
        errorCode: "SERVICE_ACTION_UNAUTHORIZED",
        errorMessage: `Invalid request: Unauthorized action: ${serviceConfig.serviceScope} ${serviceConfig.serviceAction} for project: ${project.name} (${project.publishableKey}). You can view the restrictions on this API key in your dashboard:  https://thirdweb.com/create-api-key`,
        status: 403,
      };
    }
  }

  return {
    authMethod,
    authorized: true,
    project,
    team,
  };
}
