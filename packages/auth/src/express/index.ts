import loginHandler from "./routes/login";
import logoutHandler from "./routes/logout";
import userHandler from "./routes/user";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthRoute,
  ThirdwebAuthUser,
} from "./types";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import cookieParser from "cookie-parser";
import { Express, NextFunction, Request, Response } from "express";

export * from "./types";

export function getUser(req: Request): ThirdwebAuthUser | null {
  return req.user;
}

export function ThirdwebAuth(app: Express, cfg: ThirdwebAuthConfig) {
  const ctx = {
    ...cfg,
    sdk: ThirdwebSDK.fromPrivateKey(cfg.privateKey, "mainnet"),
  };

  const authUrl = cfg.authUrl?.replace(/\/$/, "") || "/auth";

  app.use(cookieParser());

  app.use(async (req: Request, _: Response, next: NextFunction) => {
    const { sdk, domain } = ctx;
    let user = null;
    const token = req.cookies.thirdweb_auth_token;

    if (token) {
      try {
        const address = await sdk.auth.authenticate(domain, token);
        
        if (ctx.callbacks?.user) {
          user = ctx.callbacks.user(address);
        }
  
        user = { ...user, address };
      } catch {
        // No-op
      }
    }

    req.user = user as ThirdwebAuthUser | null;
    next();
  });

  app.get(`${authUrl}/:route`, (req: Request, res: Response) => {
    const action = req.params.route as ThirdwebAuthRoute;

    switch (action) {
      case "login":
        return loginHandler(req, res, ctx);
      case "user":
        return userHandler(req, res);
      case "logout":
        return logoutHandler(req, res);
      default:
        return res.status(400).json({
          message: "Invalid route for authentication.",
        });
    }
  });
}
