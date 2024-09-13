import { type NextRequest, NextResponse } from "next/server";
import { getLoginPayload } from "../../../login/auth-actions";

export const GET = async (req: NextRequest) => {
  const address = req.nextUrl.searchParams.get("address");
  const chainId = req.nextUrl.searchParams.get("chainId");

  if (!address) {
    return NextResponse.json(
      {
        error: "Missing address parameter",
      },
      {
        status: 400,
      },
    );
  }

  const result = await getLoginPayload({
    address,
    chainId: chainId ? Number.parseInt(chainId) : undefined,
  });

  return NextResponse.json(result);
};
