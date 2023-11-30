import {
  getActiveCookie,
  getActiveAccountCookie,
  getUser,
} from "../helpers/user";
import { ThirdwebAuthContext } from "../types";
import { serialize } from "cookie";
import { Request, Response } from "express";

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

  const activeCookie = getActiveCookie(req, ctx);
  const activeAccountCookie = getActiveAccountCookie(ctx);

  if (!activeCookie) {
    return res.status(400).json({
      error: "No logged in user to logout.",
    });
  }

  if (ctx.callbacks?.onLogout) {
    const user = await getUser(req, ctx);
    if (user) {
      await ctx.callbacks.onLogout(user, req);
    }
  }

  const opts = {
    domain: ctx.cookieOptions?.domain,
    path: ctx.cookieOptions?.path || "/",
    sameSite: ctx.cookieOptions?.sameSite || "none",
    expires: new Date(),
    httpOnly: true,
    secure: ctx.cookieOptions?.secure || true,
  };

  // Set the access token to 'none' and expire immediately
  res.setHeader("Set-Cookie", [
    serialize(activeCookie, "", opts),
    serialize(activeAccountCookie, "", opts),
  ]);

  return res.status(200).json({ message: "Successfully logged out" });
}
