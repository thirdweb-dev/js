import { Engine } from "@thirdweb-dev/engine";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Address } from "thirdweb";

const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;

const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ENGINE_ACCESS_TOKEN as string,
});

const chain = "84532";

type Receiver = {
  toAddress: Address;
  amount: string;
};

type DataEntry = {
  toAddress: string;
  amount: string;
};

export async function POST(req: NextRequest) {
  try {
    const { data, contractAddress } = await req.json();

    console.log("Received request with:", {
      contractAddress,
      dataLength: data.length,
      sampleData: data[0],
    });

    const receivers: Receiver[] = data.map((entry: DataEntry) => ({
      toAddress: entry.toAddress as Address,
      amount: entry.amount,
    }));

    const chunks: Receiver[][] = [];
    const chunkSize = 10;
    for (let i = 0; i < receivers.length; i += chunkSize) {
      chunks.push(receivers.slice(i, i + chunkSize));
    }

    // Process first chunk and return immediately with queued status
    const firstChunk = chunks[0];
    const res = await engine.erc20.mintBatchTo(
      chain,
      contractAddress,
      BACKEND_WALLET_ADDRESS,
      {
        data: firstChunk,
      },
    );

    // Return initial queued status
    const initialResult = {
      queueId: res.result.queueId,
      status: "queued" as const,
      addresses: firstChunk.map((r) => r.toAddress),
      amounts: firstChunk.map((r) => r.amount),
      timestamp: Date.now(),
      chainId: Number.parseInt(chain),
      network: "Base Sep" as const,
    };

    // Start polling in the background
    pollToMine(res.result.queueId).then((pollResult) => {
      console.log("Transaction completed:", pollResult);
    });

    return NextResponse.json([initialResult]);
  } catch (error: unknown) {
    console.error("Detailed error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Transfer failed",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

async function pollToMine(queueId: string) {
  try {
    const status = await engine.transaction.status(queueId);

    if (status.result.status === "mined") {
      const transactionHash = status.result.transactionHash;
      const blockExplorerUrl = `https://base-sepolia.blockscout.com/tx/${transactionHash}`;
      return { status: "Mined", queueId, transactionHash, blockExplorerUrl };
    }

    return {
      status:
        status.result.status.charAt(0).toUpperCase() +
        status.result.status.slice(1),
      queueId,
    };
  } catch (error) {
    console.error("Error checking transaction status:", error);
    return {
      status: "error",
      queueId,
      errorMessage: "Failed to check transaction status",
    };
  }
}
