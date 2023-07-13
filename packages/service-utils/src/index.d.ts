import { Service } from "./types";
import { AuthorizeCFWorkerOptions, AuthorizeNodeServiceOptions } from './auth/types'

export function getServiceByName(srv: Service): Service | undefined;

export function authorizeCFWorkerService(options: AuthorizeCFWorkerOptions);

export function authorizeNodeService(options: AuthorizeNodeServiceOptions);
