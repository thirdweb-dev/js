import type { NextRequest } from "next/server";

import {
  PayloadBodySchema,
  ThirdwebAuthContext,
} from "../types";

export default async function handler(
  req: NextRequest,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "POST") {
    return Response.json(
      { error: "Invalid method. Only POST supported." },
      { status: 405 },
    );
  }

  const reqBody = await req.json();
  const parsedPayload = PayloadBodySchema.safeParse(reqBody);

  if (!parsedPayload.success) {
    return Response.json(
      { error: "Please provide an address." },
      { status: 400 },
    );
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

  const response = Response.json({ payload }, { status: 200 });
  return response;
}
