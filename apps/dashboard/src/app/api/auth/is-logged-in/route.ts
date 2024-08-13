import { type NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../login/auth-actions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");

  if (!address) {
    throw new Error("Missing address");
  }

  const loginPayloadVal = await isLoggedIn(address);

  return NextResponse.json({
    isLoggedIn: loginPayloadVal,
  });
}
