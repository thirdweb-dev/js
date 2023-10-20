import { getActiveCookie, getUser } from "../helpers/user";
import { ThirdwebAuthContext } from "../types";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

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

  const activeCookie = getActiveCookie(req);
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

  // Set the access token to 'none' and expire in 5 seconds
  res.setHeader(
    "Set-Cookie",
    serialize(activeCookie, "", {
      domain: ctx.cookieOptions?.domain,
      path: ctx.cookieOptions?.path || "/",
      sameSite: ctx.cookieOptions?.sameSite || "none",
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
      secure: ctx.cookieOptions?.secure || true,
    }),
  );

  return res.status(200).json({ message: "Successfully logged out" });
}
