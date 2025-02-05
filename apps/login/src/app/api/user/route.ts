import { type NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../authorization/jwt";

export const GET = async (req: NextRequest) => {
  const jwt = req.headers.get("Authorization")?.split("Bearer ")[1];
  if (!jwt) {
    return NextResponse.json(
      {
        message: "No JWT provided",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const verifiedPayload = await verifyJWT(jwt);
    return NextResponse.json({
      address: verifiedPayload.sub,
    });
  } catch (e) {
    console.error("failed", e);
    return NextResponse.json(
      {
        message: "Invalid JWT",
      },
      {
        status: 401,
      },
    );
  }
};
