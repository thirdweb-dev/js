import { FastifyInstance } from "fastify";
import { ThirdwebAuth as ThirdwebAuthSDK } from "../core";
import fastifyCookie from "@fastify/cookie";
import loginHandler from "./routes/login";

type ThirdwebAuthReturnType = {
  authRouter: (fastify: FastifyInstance) => void;
};

export function ThirdwebAuth(cfg: any): ThirdwebAuthReturnType {
  const ctx = {
    ...cfg,
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain),
  };

  const authRouter = async (fastify: FastifyInstance) => {
    await fastify.register(fastifyCookie);

    fastify.post("/login", async (req, res) => {
      loginHandler(req, res, ctx);
    });
  };

  return {
    authRouter,
  };
}
