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
  ThirdwebAuthUser,
} from "./types";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";

export * from "./types";
export { getToken } from "./helpers/user";

const asyncHandler =
  (fn: CallableFunction) =>
  (...args: any[]) => {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

type ThirdwebAuthReturnType<
  TData extends Json = Json,
  TSession extends Json = Json,
> = {
  authRouter: express.Router;
  authMiddleware: express.RequestHandler;
  getUser: (req: Request) => Promise<ThirdwebAuthUser<TData, TSession> | null>;
};

export function ThirdwebAuth<
  TData extends Json = Json,
  TSession extends Json = Json,
>(
  cfg: ThirdwebAuthConfig<TData, TSession>,
): ThirdwebAuthReturnType<TData, TSession> {
  const ctx = {
    ...cfg,
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain, cfg.thirdwebAuthOptions),
  };

  const router = express.Router();
  const cookieMiddleware = cookieParser();

  router.use(express.json());
  router.use(cookieMiddleware);

  router.post(
    "/payload",
    asyncHandler((req: Request, res: Response) =>
      payloadHandler(req, res, ctx as ThirdwebAuthContext),
    ),
  );

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

  router.post(
    "/switch-account",
    asyncHandler((req: Request, res: Response) =>
      switchAccountHandler(req, res, ctx as ThirdwebAuthContext),
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
