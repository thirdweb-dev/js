import { toNodeHandler as toNode } from "better-call/node";

/**
 * Converts a thirdweb auth router to a Node.js handler.
 * @param auth - The thirdweb auth router to convert.
 * @returns The Node.js handler.
 *
 * @example
 * ```ts
 * import { createThirdwebClient, Engine, Login } from "thirdweb";
 *
 * // Create a Thirdweb client
 * const client = createThirdwebClient({
 *   secretKey: "your-secret-key"
 * });
 *
 * // Create a server wallet
 * const serverWallet = Engine.serverWallet({
 *   client,
 *   address: "0x...",
 *   vaultAccessToken: "your-vault-token"
 * });
 *
 * // Create the auth handler
 * const authHandler = Login.Server.createAuthHandler({
 *   client,
 *   serverWallet,
 *   // Optional: Configure additional auth options
 *   ...
 * });
 *
 * // Usage with express
 * const app = express();
 * app.all("/api/auth/*", Login.Server.toNodeHandler(authHandler));
 *
 * app.listen(3000);
 * ```
 */
export function toNodeHandler(
  auth:
    | {
        handler: (request: Request) => Promise<Response>;
      }
    | ((request: Request) => Promise<Response>),
) {
  return "handler" in auth ? toNode(auth.handler) : toNode(auth);
}
