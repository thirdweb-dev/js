import { createEndpoint, createRouter } from "better-call";
import { z } from "zod";
import { createAuth } from "../../auth/auth.js";
import type { AuthOptions } from "../../auth/core/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { ServerWallet } from "../../engine/server-wallet.js";
import { isAddress } from "../../utils/address.js";
import { decodeJWT } from "../../utils/jwt/decode-jwt.js";

export type CreateAuthHandlerOptions = Omit<AuthOptions, "adminAccount"> & {
  client: ThirdwebClient;
  serverWallet: ServerWallet;
  basePath?: string;
};

/**
 * Creates a Thirdweb authentication router with endpoints for handling user authentication.
 * This router provides endpoints for generating authentication payloads, logging in users,
 * checking login status, and logging out users.
 *
 * @param options - Configuration options for the auth router
 * @param options.client - The Thirdweb client instance
 * @param options.serverWallet - The server wallet to use for admin operations
 * @param options.basePath - The base path for the auth router
 *
 * @returns A router with the following endpoints:
 * - GET /payload - Generates an authentication payload for a given address
 * - POST /login - Verifies a payload signature and generates a JWT
 * - GET /is-logged-in - Checks if a user is currently logged in
 * - POST /logout - Logs out the current user
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
 * // Use with your server framework (this example uses hono)
 * import { Hono } from "hono";
 * import { serve } from "@hono/node-server";
 * import { cors } from "hono/cors";
 *
 * const app = new Hono();
 *
 * app.on(["POST", "GET"], "/api/auth/**", (c) => authHandler.handler(c.req.raw));
 *
 * serve(app);
 * ```
 */
export function createAuthHandler({
  serverWallet,
  basePath = "/api/auth",
  ...options
}: CreateAuthHandlerOptions) {
  // re-map the server wallet to the admin account option
  const twAuth = createAuth({ ...options, adminAccount: serverWallet });

  // payload generation endpoint
  const getPayload = createEndpoint(
    "/payload",
    {
      method: "GET",
      query: z.object({
        address: z.string().refine(isAddress, "Invalid address"),
        chainId: z.coerce.number().optional(),
      }),
    },
    (ctx) => {
      return twAuth.generatePayload({
        address: ctx.query.address,
        chainId: ctx.query.chainId,
      });
    },
  );

  // payload verification endpoint
  const login = createEndpoint(
    "/login",
    {
      method: "POST",
      body: z.object({
        payload: z.object({
          domain: z.string(),
          address: z.string(),
          statement: z.string(),
          uri: z.string().optional(),
          version: z.string(),
          chain_id: z.string().optional(),
          nonce: z.string(),
          issued_at: z.string(),
          expiration_time: z.string(),
          invalid_before: z.string(),
          resources: z.array(z.string()).optional(),
        }),
        signature: z.string(),
      }),
    },
    async (ctx) => {
      const { payload, signature } = ctx.body;
      const result = await twAuth.verifyPayload({ payload, signature });
      if (!result.valid) {
        // if the payload is invalid, return a 401 error
        throw ctx.error(401, {
          message: result.error,
        });
      }

      // construct the JWT
      const jwt = await twAuth.generateJWT({ payload: result.payload });

      const decodedJWT = decodeJWT(jwt);
      const expTime =
        typeof decodedJWT.payload.exp === "string"
          ? Number.parseInt(decodedJWT.payload.exp, 10)
          : decodedJWT.payload.exp;

      if (!expTime || Number.isNaN(expTime)) {
        throw ctx.error(500, {
          message: "Invalid JWT expiration time",
        });
      }

      const expiresAt = new Date(expTime * 1000);
      const thirtyDaysInSeconds = 60 * 60 * 24 * 30;
      const maxAgeInSeconds = Math.min(
        thirtyDaysInSeconds,
        Math.floor((expiresAt.getTime() - Date.now()) / 1000),
      );

      // try to set the JWT on the client's cookies
      ctx.setCookie("tw:jwt", jwt, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: maxAgeInSeconds,
        expires: expiresAt,
      });

      // return the constructed JWT
      return {
        jwt,
        expiresAt: expiresAt.toISOString(),
      };
    },
  );

  const isLoggedIn = createEndpoint(
    "/is-logged-in",
    {
      method: "GET",
      requireHeaders: true,
    },
    async (ctx) => {
      let [type, token] = ctx.headers.get("authorization")?.split(" ") ?? [];

      // if the token is set but the type is not Bearer, return a 401 error
      if (token && (!type || type !== "Bearer")) {
        throw ctx.error(401, {
          message: "Invalid authorization header",
        });
      }

      // if the token is not set, try to get it from the cookies
      if (!token) {
        token = ctx.getCookie("tw:jwt") ?? undefined;
      }

      if (!token) {
        throw ctx.error(401, {
          message: "Missing token",
        });
      }

      const result = await twAuth.verifyJWT({ jwt: token });
      if (!result.valid) {
        throw ctx.error(401, {
          message: result.error,
        });
      }

      return {
        address: result.parsedJWT.aud,
        jwt: token,
        expiresAt: new Date(result.parsedJWT.exp * 1000).toISOString(),
      };
    },
  );

  const logout = createEndpoint(
    "/logout",
    {
      method: "POST",
    },
    async (ctx) => {
      ctx.setCookie("tw:jwt", "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 0,
        expires: new Date(0),
      });
    },
  );

  return createRouter(
    {
      getPayload,
      login,
      isLoggedIn,
      logout,
    },
    {
      basePath,
    },
  );
}

export type AuthRouter = ReturnType<typeof createAuthHandler>;
