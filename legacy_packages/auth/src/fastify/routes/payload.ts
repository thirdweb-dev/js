import {
  FastifyInstanceWithZod,
  PayloadBodySchema,
  ThirdwebAuthContext,
} from "../types";
import { z } from "zod";

export const payloadHandler = (
  fastify: FastifyInstanceWithZod,
  ctx: ThirdwebAuthContext,
) => {
  fastify.route<{
    Body: z.infer<typeof PayloadBodySchema>;
  }>({
    method: "POST",
    url: "/payload",
    schema: {
      body: PayloadBodySchema,
      response: {
        200: z.any(),
      },
    },
    handler: async (req, res) => {
      const payload = await ctx.auth.payload({
        address: req.body.address,
        statement: ctx.authOptions?.statement,
        uri: ctx.authOptions?.uri,
        version: ctx.authOptions?.version,
        chainId: req.body.chainId || ctx.authOptions?.chainId,
        resources: ctx.authOptions?.resources,
        expirationTime: ctx.authOptions?.loginPayloadDurationInSeconds
          ? new Date(
              Date.now() + 1000 * ctx.authOptions.loginPayloadDurationInSeconds,
            )
          : undefined,
      });

      return res.status(200).send({ payload });
    },
  });
};
