import { serialize } from "cookie";
import { getToken } from "../helpers/user";
import { ActiveBodySchema, ThirdwebAuthContext } from "../types";
import { NextApiRequest, NextApiResponse } from "next";
import { THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE } from "../../constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Invalid method. Only POST supported.",
    });
  }

  const parsedPayload = ActiveBodySchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return res.status(400).json({ error: "Please provide an address" });
  }

  console.log("Checking for token....");
  const token = getToken(req);
  if (!token) {
    return res.status(400).json({ error: "No currently active account" });
  }

  const {
    payload: { exp },
  } = ctx.auth.parseToken(token);

  res.setHeader("Set-Cookie", [
    serialize(THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE, parsedPayload.data.address, {
      domain: ctx.cookieOptions?.domain,
      path: ctx.cookieOptions?.path || "/",
      sameSite: ctx.cookieOptions?.sameSite || "none",
      expires: new Date(exp * 1000),
      httpOnly: true,
      secure: true,
    }),
  ]);

  return res.status(200).end();
}
