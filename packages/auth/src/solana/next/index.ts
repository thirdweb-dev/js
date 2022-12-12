import loginHandler from "./routes/login";
import logoutHandler from "./routes/logout";
import userHandler from "./routes/user";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthContext,
  ThirdwebAuthRoute,
  ThirdwebAuthUser,
} from "./types";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { NextRequest } from "next/server";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next/types";

export * from "./types";

async function ThirdwebAuthRouter(
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: ThirdwebAuthContext,
) {
  // Catch-all route must be named with [...thirdweb]
  const { thirdweb } = req.query;
  const action = thirdweb?.[0] as ThirdwebAuthRoute;

  switch (action) {
    case "login":
      return await loginHandler(req, res, ctx);
    case "user":
      return await userHandler(req, res, ctx);
    case "logout":
      return await logoutHandler(req, res);
    default:
      return res.status(400).json({
        message: "Invalid route for authentication.",
      });
  }
}

export function ThirdwebAuth(cfg: ThirdwebAuthConfig) {
  const ctx = {
    ...cfg,
    sdk: ThirdwebSDK.fromPrivateKey("mainnet-beta", cfg.privateKey),
  };

  function ThirdwebAuthHandler(
    ...args: [] | [NextApiRequest, NextApiResponse]
  ) {
    if (args.length === 0) {
      return async (req: NextApiRequest, res: NextApiResponse) =>
        await ThirdwebAuthRouter(req, res, ctx);
    }

    return ThirdwebAuthRouter(args[0], args[1], ctx);
  }

  async function getUser(
    req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
  ) {
    const { sdk, domain } = ctx;
    let user: ThirdwebAuthUser | null = null;
    const token =
      typeof req.cookies.get === "function"
        ? (req.cookies as any).get("thirdweb_auth_token")
        : (req.cookies as any).thirdweb_auth_token;

    if (token) {
      try {
        const address = await sdk.auth.authenticate(domain, token);

        let data = {};
        if (ctx.callbacks?.user) {
          data = await ctx.callbacks.user(address);
        }

        user = { ...data, address };
      } catch {
        // No-op
      }
    }

    return user;
  }

  return { ThirdwebAuthHandler, getUser };
}
