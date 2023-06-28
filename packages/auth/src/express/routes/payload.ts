import { Request, Response } from "express";
import { PayloadBodySchema, ThirdwebAuthContext } from "../types";

export default async function handler(
  req: Request,
  res: Response,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Invalid method. Only POST supported.",
    });
  }

  const parsedPayload = PayloadBodySchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return res.status(400).json({ error: "Please provide an address" });
  }

  // TODO: Add nonce generation + custom expiration + invalid before
  const payload = await ctx.auth.payload({
    address: parsedPayload.data.address,
    statement: ctx.authOptions?.statement,
    uri: ctx.authOptions?.uri,
    version: ctx.authOptions?.version,
    chainId: parsedPayload.data.chainId || ctx.authOptions?.chainId,
    resources: ctx.authOptions?.resources,
    expirationTime: ctx.authOptions?.loginPayloadDurationInSeconds
      ? new Date(
          Date.now() + 1000 * ctx.authOptions.loginPayloadDurationInSeconds,
        )
      : undefined,
  });

  return res.status(200).json({ payload });
}
