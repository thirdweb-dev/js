import { type NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../login/auth-actions";
import { getAuthToken } from "../../lib/getAuthToken";

export type isLoggedInResponseType =
  | {
      isLoggedIn: true;
      jwt: string;
    }
  | {
      isLoggedIn: false;
    };

function sendResponse(data: isLoggedInResponseType) {
  return NextResponse.json(data);
}

export const GET = async (req: NextRequest) => {
  const address = req.nextUrl.searchParams.get("address");
  const authToken = getAuthToken();

  if (!address || !authToken) {
    return sendResponse({
      isLoggedIn: false,
    });
  }

  const result = await isLoggedIn(address);

  return sendResponse({
    isLoggedIn: result,
    jwt: authToken,
  });
};
