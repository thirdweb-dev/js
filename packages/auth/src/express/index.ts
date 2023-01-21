import { ThirdwebAuth as ThirdwebAuthSDK } from "../core";
import { getUser } from "./helpers/user";
import loginHandler from "./routes/login";
import logoutHandler from "./routes/logout";
import userHandler from "./routes/user";
import { ThirdwebAuthConfig } from "./types";
import bodyParser from "body-parser";
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

export function ThirdwebAuth(cfg: ThirdwebAuthConfig) {
  const ctx = {
    ...cfg,
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain),
  };

  const router = express.Router();
  const cookieMiddleware = cookieParser();

  router.use(bodyParser.json());
  router.use(cookieMiddleware);

  router.post(
    "/login",
    asyncHandler((req: Request, res: Response) => loginHandler(req, res, ctx)),
  );

  router.get(
    "/user",
    asyncHandler((req: Request, res: Response) => userHandler(req, res, ctx)),
  );

  router.post(
    "/logout",
    asyncHandler((req: Request, res: Response) => logoutHandler(req, res, ctx)),
  );

  return {
    authRouter: router,
    authMiddleware: cookieMiddleware,
    getUser: (req: Request) => {
      return getUser(req, ctx);
    },
  };
}
