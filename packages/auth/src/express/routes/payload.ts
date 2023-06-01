import { Request, Response } from "express";
import { ThirdwebAuthContext } from "../types";

export default async function handler(
  req: Request,
  res: Response,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Invalid method. Only GET supported.",
    });
  }

  // TODO: Add nonce generation + custom expiration + invalid before
  const payload = await ctx.auth.payload({
    statement: ctx.authOptions?.statement,
    uri: ctx.authOptions?.uri,
    version: ctx.authOptions?.version,
    chainId: ctx.authOptions?.chainId,
    resources: ctx.authOptions?.resources,
  });

  return res.status(200).json({ payload });
}
