import { Engine } from "@thirdweb-dev/engine";
import { type NextRequest, NextResponse } from "next/server";

const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ACCESS_TOKEN as string,
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const queueId = searchParams.get("queueId");

  if (!queueId) {
    return NextResponse.json({ error: "Missing queueId" }, { status: 400 });
  }

  try {
    const status = await engine.transaction.status(queueId);

    if (status.result.status === "mined") {
      const transactionHash = status.result.transactionHash;
      const blockExplorerUrl = `https://base-sepolia.blockscout.com/tx/${transactionHash}`;
      return NextResponse.json({
        status: "Mined",
        transactionHash,
        blockExplorerUrl,
      });
    }

    return NextResponse.json({
      status: status.result.status,
      errorMessage: status.result.errorMessage,
    });
  } catch (error) {
    console.error("Error checking transaction status:", error);
    return NextResponse.json(
      { error: "Failed to check transaction status" },
      { status: 500 },
    );
  }
}
