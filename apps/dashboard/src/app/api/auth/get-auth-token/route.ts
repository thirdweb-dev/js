import { COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getAddress } from "thirdweb/utils";
import { getCachedRawAccountForAuthToken } from "../../../account/settings/getAccount";

export type GetAuthTokenResponse = {
  jwt: string | null;
};

function respond(jwt: string | null) {
  const responseObj: GetAuthTokenResponse = {
    jwt,
  };
  return NextResponse.json(responseObj);
}

export const GET = async (req: NextRequest) => {
  const address = req.nextUrl.searchParams.get("address");
  const cookieStore = await cookies();

  if (!address) {
    return NextResponse.json(
      {
        error: "address is required",
      },
      {
        status: 400,
      },
    );
  }

  const authCookieName = COOKIE_PREFIX_TOKEN + getAddress(address);

  // check if we have a token for the address
  const token = cookieStore.get(authCookieName)?.value;

  // no auth token found for the address
  if (!token) {
    return respond(null);
  }

  // check token validity
  const account = await getCachedRawAccountForAuthToken(token);

  if (!account) {
    return respond(null);
  }

  return respond(token);
};
