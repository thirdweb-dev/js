import { ThirdwebAuthContext } from "../types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
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
