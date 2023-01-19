import { ThirdwebAuth as ThirdwebAuthSDK } from "../core";
import { getUser } from "./helpers/user";
import loginHandler from "./routes/login";
import logoutHandler from "./routes/logout";
import userHandler from "./routes/user";
import { ThirdwebAuthConfig } from "./types";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";

export * from "./types";

export function ThirdwebAuth(cfg: ThirdwebAuthConfig) {
  const ctx = {
    ...cfg,
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain),
  };

  const router = express.Router();

  router.use(cookieParser());

  router.post("/login", (req: Request, res: Response) =>
    loginHandler(req, res, ctx),
  );

  router.get("/user", (req: Request, res: Response) =>
    userHandler(req, res, ctx),
  );

  router.post("/logout", (req: Request, res: Response) =>
    logoutHandler(req, res, ctx),
  );

  return {
    thirdwebAuth: router,
    getUser: (req: Request) => {
      return getUser(req, ctx);
    },
  };
}
