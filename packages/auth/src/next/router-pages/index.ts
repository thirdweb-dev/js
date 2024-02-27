import { Json, ThirdwebAuth as ThirdwebAuthSDK } from "../../core";
import { getUser } from "./helpers/user";
import payloadHandler from "./routes/payload";
import loginHandler from "./routes/login";
import logoutHandler from "./routes/logout";
import userHandler from "./routes/user";
import switchAccountHandler from "./routes/switch-account";
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
    case "payload":
      return await payloadHandler(req, res, ctx);
    case "login":
      return await loginHandler(req, res, ctx);
    case "user":
      return await userHandler(req, res, ctx);
    case "logout":
      return await logoutHandler(req, res, ctx);
    case "switch-account":
      return await switchAccountHandler(req, res, ctx);
    default:
      return res.status(400).json({
        message: "Invalid route for authentication.",
      });
  }
}

export function ThirdwebAuth<
  TData extends Json = Json,
  TSession extends Json = Json,
>(cfg: ThirdwebAuthConfig<TData, TSession>) {
  const ctx = {
    ...cfg,
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain),
  };

  function ThirdwebAuthHandler(
    ...args: [] | [NextApiRequest, NextApiResponse]
  ) {
    if (args.length === 0) {
      return async (req: NextApiRequest, res: NextApiResponse) =>
        await ThirdwebAuthRouter(req, res, ctx as ThirdwebAuthContext);
    }

    return ThirdwebAuthRouter(args[0], args[1], ctx as ThirdwebAuthContext);
  }

  return {
    ThirdwebAuthHandler,
    getUser: (
      req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
    ) => {
      return getUser<TData, TSession>(req, ctx);
    },
  };
}
