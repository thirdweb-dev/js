import { FastifyInstance, FastifyRequest } from "fastify";
import { Json, ThirdwebAuth as ThirdwebAuthSDK } from "../core";
import fastifyCookie, { FastifyCookie } from "@fastify/cookie";
import payloadHandler from "./routes/payload";
import loginHandler from "./routes/login";
import userHandler from "./routes/user";
import switchAccountHandler from "./routes/switch-account";
import logoutHandler from "./routes/logout";
import { getUser } from "./helpers/user";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthContext,
  ThirdwebAuthUser,
} from "./types";

type ThirdwebAuthReturnType<
  TData extends Json = Json,
  TSession extends Json = Json,
> = {
  authRouter: (fastify: FastifyInstance) => void;
  authMiddleware: FastifyCookie;
  getUser: (
    req: FastifyRequest,
  ) => Promise<ThirdwebAuthUser<TData, TSession> | null>;
};

export function ThirdwebAuth<
  TData extends Json = Json,
  TSession extends Json = Json,
>(
  cfg: ThirdwebAuthConfig<TData, TSession>,
): ThirdwebAuthReturnType<TData, TSession> {
  const ctx = {
    ...cfg,
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain),
  };

  const authRouter = async (fastify: FastifyInstance) => {
    await fastify.register(fastifyCookie);

    fastify.post("/payload", async (req, res) => {
      payloadHandler(req, res, ctx as ThirdwebAuthContext);
    });

    fastify.post("/login", async (req, res) => {
      loginHandler(req, res, ctx as ThirdwebAuthContext);
    });

    fastify.get("/user", async (req, res) => {
      userHandler(req, res, ctx as ThirdwebAuthContext);
    });

    fastify.post("/logout", async (req, res) => {
      logoutHandler(req, res, ctx as ThirdwebAuthContext);
    });

    fastify.post("/switch-account", async (req, res) => {
      switchAccountHandler(req, res, ctx as ThirdwebAuthContext);
    });
  };

  return {
    authRouter,
    authMiddleware: fastifyCookie,
    getUser: (req: FastifyRequest) => {
      return getUser<TData, TSession>(req, ctx);
    },
  };
}
