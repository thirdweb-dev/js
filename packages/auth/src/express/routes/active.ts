import { Request, Response } from "express";
import { ActiveBodySchema, ThirdwebAuthContext } from "../types";
import { serialize } from "cookie";
import { THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE } from "../../constants";
import { getToken } from "../helpers/user";

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

  const parsedPayload = ActiveBodySchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return res.status(400).json({ error: "Please provide an address" });
  }

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
