import { Json, ThirdwebAuth as ThirdwebAuthSDK } from "../core";
import { getUser } from "./helpers/user";
import loginHandler from "./routes/login";
import logoutHandler from "./routes/logout";
import userHandler from "./routes/user";
import { ThirdwebAuthConfig, ThirdwebAuthContext } from "./types";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";

export * from "./types";

const asyncHandler =
  (fn: CallableFunction) =>
  (...args: any[]) => {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

export function ThirdwebAuth<
  TData extends Json = Json,
  TSession extends Json = Json,
>(cfg: ThirdwebAuthConfig<TData, TSession>) {
  const ctx = {
    ...cfg,
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain),
  };

  const router = express.Router();
  const cookieMiddleware = cookieParser();

  router.use(express.json());
  router.use(cookieMiddleware);

  router.post(
    "/login",
    asyncHandler((req: Request, res: Response) =>
      loginHandler(req, res, ctx as ThirdwebAuthContext),
    ),
  );

  router.get(
    "/user",
    asyncHandler((req: Request, res: Response) =>
      userHandler(req, res, ctx as ThirdwebAuthContext),
    ),
  );

  router.post(
    "/logout",
    asyncHandler((req: Request, res: Response) =>
      logoutHandler(req, res, ctx as ThirdwebAuthContext),
    ),
  );

  return {
    authRouter: router,
    authMiddleware: cookieMiddleware,
    getUser: (req: Request) => {
      return getUser<TData, TSession>(req, ctx);
    },
  };
}
