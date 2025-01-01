import { isSimpleHashSupported } from "lib/wallet/nfts/simpleHash";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const chainIdStr = searchParams.get("chainId");

  if (!chainIdStr) {
    return NextResponse.json(
      {
        error: "Missing chain ID parameter.",
      },
      { status: 400 },
    );
  }

  const chainId = Number.parseInt(chainIdStr);

  if (!Number.isInteger(chainId)) {
    return NextResponse.json(
      {
        error: "Invalid chain ID parameter.",
      },
      { status: 400 },
    );
  }

  const found = await isSimpleHashSupported(chainId);

  return NextResponse.json({ result: found });
};
