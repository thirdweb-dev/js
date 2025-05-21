export * as Client from "./client/index.js";
export * as Server from "./server/index.js";

// client
export { login, type LoginOptions, type LoginResult } from "./client/login.js";

// server
export {
  createAuthHandler,
  type CreateAuthHandlerOptions,
} from "./server/auth-handler.js";
export { toNodeHandler } from "./server/integrations/node.js";
export { toNextJsHandler } from "./server/integrations/next-js.js";
