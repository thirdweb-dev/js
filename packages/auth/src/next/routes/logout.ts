import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getActiveCookie, getUser } from "../helpers/user";
import { ThirdwebAuthContext } from "../types";

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

  const activeCookie = getActiveCookie();
  if (!activeCookie) {
    return Response.json(
      { error: "No logged in user to logout." },
      { status: 400 },
    );
  }

  if (ctx.callbacks?.onLogout) {
    const user = await getUser(ctx);
    if (user) {
      await ctx.callbacks.onLogout(user);
    }
  }

  // Set the access token to 'none' and expire in 5 seconds
  const response = NextResponse.json(
    { message: "Successfully logged out." },
    { status: 200 },
  );

  response.cookies.set({
    name: activeCookie,
    value: '',
    domain: ctx.cookieOptions?.domain,
    path: ctx.cookieOptions?.path || "/",
    sameSite: ctx.cookieOptions?.sameSite || "none",
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: ctx.cookieOptions?.secure || true,
  });

  return response;
}
