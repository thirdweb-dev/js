import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { Json, ThirdwebAuth as ThirdwebAuthSDK } from "../core";
import fastifyCookie, { FastifyCookie } from "@fastify/cookie";
import { payloadHandler } from "./routes/payload";
import { loginHandler } from "./routes/login";
import { userHandler } from "./routes/user";
import { logoutHandler } from "./routes/logout";
import { switchAccountHandler } from "./routes/switch-account";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { getUser } from "./helpers/user";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthContext,
  ThirdwebAuthUser,
} from "./types";

export * from "./types";
export { getToken } from "./helpers/user";

type ThirdwebAuthReturnType<
  TData extends Json = Json,
  TSession extends Json = Json,
> = {
  authRouter: (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (err?: Error | undefined) => void,
  ) => void;
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
    auth: new ThirdwebAuthSDK(cfg.wallet, cfg.domain, cfg.thirdwebAuthOptions),
  };

  const authRouter = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: (err?: Error | undefined) => void,
  ) => {
    // Setup plugin to use zod as a type provider
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);
    const plugin = fastify.withTypeProvider<ZodTypeProvider>();

    // Register the fastify cookie middleware with this plugin
    await plugin.register(fastifyCookie);

    // Register individual auth endpoints
    payloadHandler(plugin, ctx as ThirdwebAuthContext);
    loginHandler(plugin, ctx as ThirdwebAuthContext);
    logoutHandler(plugin, ctx as ThirdwebAuthContext);
    userHandler(plugin, ctx as ThirdwebAuthContext);
    switchAccountHandler(plugin, ctx as ThirdwebAuthContext);

    // Mark plugin creation as complete
    done();
  };

  return {
    authRouter,
    authMiddleware: fastifyCookie,
    getUser: (req: FastifyRequest) => {
      return getUser<TData, TSession>(req, ctx);
    },
  };
}
