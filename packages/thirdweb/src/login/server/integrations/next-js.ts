/**
 * Converts a login router to a Next.js handler.
 * @param auth - The login router to convert.
 * @returns The Next.js handler.
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
 * export const { GET, POST } = Login.Server.toNextJsHandler(router);
 * ```
 */
export function toNextJsHandler(
  auth:
    | {
        handler: (request: Request) => Promise<Response>;
      }
    | ((request: Request) => Promise<Response>),
) {
  const handler = async (request: Request) => {
    return "handler" in auth ? auth.handler(request) : auth(request);
  };
  return {
    GET: handler,
    POST: handler,
  };
}
