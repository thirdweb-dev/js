import { ThirdwebAuth as ThirdwebAuthSDK } from "../core";
import { getUser } from "./helpers/user";
import loginHandler from "./routes/login";
import logoutHandler from "./routes/logout";
import userHandler from "./routes/user";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthContext,
  ThirdwebAuthRoute,
} from "./types";
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
      return await logoutHandler(req, res, ctx);
    default:
      return res.status(400).json({
        message: "Invalid route for authentication.",
      });
  }
}

export function ThirdwebAuth(cfg: ThirdwebAuthConfig) {
  const ctx = {
    ...cfg,
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain),
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

  return {
    ThirdwebAuthHandler,
    getUser: (
      req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
    ) => {
      return getUser(req, ctx);
    },
  };
}
