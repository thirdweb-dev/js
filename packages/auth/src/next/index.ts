import type { NextRequest } from "next/server";

import { Json, ThirdwebAuth as ThirdwebAuthSDK } from "../core";
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
  NextContext,
} from "./types";

export * from "./types";

async function ThirdwebAuthRouter(
  req: NextRequest,
  ctx: NextContext,
  authCtx: ThirdwebAuthContext,
) {
  // Catch-all route must be named with [...thirdweb]
  const action = ctx.params?.thirdweb?.[0] as ThirdwebAuthRoute;

  switch (action) {
    case "payload":
      return await payloadHandler(req, authCtx);
    case "login":
      return await loginHandler(req, authCtx);
    case "user":
      return await userHandler(req, authCtx);
    case "logout":
      return await logoutHandler(req, authCtx);
    case "switch-account":
      return await switchAccountHandler(req, authCtx);
    default:
      return Response.json(
        { message: "Invalid route for authentication." },
        { status: 400},
      );
  }
}

export function ThirdwebAuth<
  TData extends Json = Json,
  TSession extends Json = Json,
>(cfg: ThirdwebAuthConfig<TData, TSession>) {
  const authCtx = {
    ...cfg,
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain),
  };

  async function ThirdwebAuthHandler(...args: [] | [NextRequest, NextContext]) {
    if (args.length === 0) {
      return async (req: NextRequest, ctx: NextContext): Promise<void | Response> =>
        await ThirdwebAuthRouter(req, ctx, authCtx as ThirdwebAuthContext);
    }

    return ThirdwebAuthRouter(args[0], args[1], authCtx as ThirdwebAuthContext);
  }

  return {
    ThirdwebAuthHandler,
    getUser: async (req?: NextRequest) => {
      return await getUser<TData, TSession>(authCtx, req);
    },
  };
}
