import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getAddress } from "thirdweb/utils";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

export type EnsureLoginResponse = {
  isLoggedIn: boolean;
  jwt?: string;
};

export const GET = async (req: NextRequest) => {
  const address = req.nextUrl.searchParams.get("address");

  const cookieStore = await cookies();
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
    });
  }

  // check that the token is valid by checking for the user account
  const accountRes = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/account/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    },
  );
  if (accountRes.status !== 200) {
    // if the account is not found, clear the token and redirect to login
    cookieStore.delete(authCookieName);
    return NextResponse.json({
      isLoggedIn: false,
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
      // 3 days
      maxAge: 3 * 24 * 60 * 60,
      sameSite: "strict",
      secure: true,
    });
  }

  // if everything is good simply return true
  return NextResponse.json({ isLoggedIn: true, jwt: token });
};
