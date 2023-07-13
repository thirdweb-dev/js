import { Service } from "./types";
import { AuthorizationOptions, AuthorizationValidations } from "./auth/types";
import { KVNamespace, ExecutionContext } from "@cloudflare/workers-types";
import { IncomingHttpHeaders } from "http";

export function getServiceByName(srv: Service): Service | undefined;

export function authorizeCFWorkerService(options: {
  ctx: ExecutionContext;
  headers: IncomingHttpHeaders;
  kvStore: KVNamespace<string>;
  clientId: string;
  authOpts: AuthorizationOptions;
  validations?: AuthorizationValidations;
});

export function authorizeNodeService(options: {
  headers: IncomingHttpHeaders;
  clientId: string;
  authOpts: AuthorizationOptions;
  validations?: AuthorizationValidations;
});
