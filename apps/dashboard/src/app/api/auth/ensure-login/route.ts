import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { decodeJWT, getAddress } from "thirdweb/utils";

export type EnsureLoginPayload = {
  pathname: string;
  address?: string;
};

export type EnsureLoginResponse = {
  isLoggedIn: boolean;
  jwt?: string;
  redirectTo?: string;
};

export const GET = async (req: NextRequest) => {
  const address = req.nextUrl.searchParams.get("address");
  const pathname = req.nextUrl.searchParams.get("pathname");

  const cookieStore = cookies();
  // if we are "disconnected" we are not logged in, clear the cookie and redirect to login
  // this is the "log out" case (for now)
  if (!address) {
    // delete all cookies that start with the token prefix
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      if (cookie.name.startsWith(COOKIE_PREFIX_TOKEN)) {
        cookieStore.delete(cookie.name);
      }
    }
    // also delete the active account cookie
    cookieStore.delete(COOKIE_ACTIVE_ACCOUNT);
    return NextResponse.json({
      isLoggedIn: false,
      redirectTo: buildLoginPath(pathname),
    });
  }

  const authCookieName = COOKIE_PREFIX_TOKEN + getAddress(address);

  // check if we have a token
  const token = cookieStore.get(authCookieName)?.value;

  // if no token, not logged in, redirect to login
  if (!token) {
    // delete the active account cookie (the account is not logged in)
    cookieStore.delete(COOKIE_ACTIVE_ACCOUNT);
    return NextResponse.json({
      isLoggedIn: false,
      redirectTo: buildLoginPath(pathname),
    });
  }

  // otherwise check if the address matches the token
  const decodedToken = decodeJWT(token);
  // user is not the same as the token, redirect to login
  if (getAddress(decodedToken.payload.sub) !== getAddress(address)) {
    cookieStore.delete(authCookieName);
    return NextResponse.json({
      isLoggedIn: false,
      redirectTo: buildLoginPath(pathname),
    });
  }

  // make sure the active account cookie is set to the correct address
  const activeAccountCookie = cookieStore.get(COOKIE_ACTIVE_ACCOUNT);
  if (
    !activeAccountCookie ||
    getAddress(activeAccountCookie.value) !== getAddress(address)
  ) {
    cookieStore.set(COOKIE_ACTIVE_ACCOUNT, getAddress(address), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      // 3 days
      maxAge: 3 * 24 * 60 * 60,
    });
  }

  // if everything is good simply return true
  return NextResponse.json({ isLoggedIn: true, jwt: token });
};

function buildLoginPath(pathname?: string | null): string {
  return `/login${pathname ? `?next=${pathname}` : ""}`;
}
