// Export thirdweb auth class
export { ThirdwebAuth } from "./auth";

// Export individual auth functions
export {
  buildJWT,
  generateJWT,
  parseJWT,
  refreshJWT,
  authenticateJWT,
} from "./functions/jwt";
export {
  buildLoginPayload,
  signLoginPayload,
  buildAndSignLoginPayload,
  verifyLoginPayload,
} from "./functions/login";

// Export schema files individually
export * from "./schema/authenticate";
export * from "./schema/common";
export * from "./schema/functions";
export * from "./schema/generate";
export * from "./schema/login";
export * from "./schema/refresh";
export * from "./schema/verify";
