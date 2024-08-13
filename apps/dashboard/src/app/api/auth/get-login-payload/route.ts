import { type NextRequest, NextResponse } from "next/server";
import { getLoginPayload } from "../../../login/auth-actions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const chainIdStr = searchParams.get("chainId");

  if (!address) {
    throw new Error("Missing address");
  }

  if (!chainIdStr) {
    throw new Error("Missing chainId");
  }

  const chainId = Number(chainIdStr);

  if (!Number.isInteger(chainId)) {
    throw new Error("Invalid chainId");
  }

  const loginPayload = await getLoginPayload({ address, chainId: chainId });

  return NextResponse.json(loginPayload);
}
