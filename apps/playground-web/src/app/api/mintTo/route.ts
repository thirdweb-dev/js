import { Engine } from "@thirdweb-dev/engine";
import * as dotenv from "dotenv";
import { type NextRequest, NextResponse } from "next/server";

dotenv.config();

const CHAIN_ID = "84532";
const CONTRACT_ADDRESS = "0x8CD193648f5D4E8CD9fD0f8d3865052790A680f6";
const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;

// Add logging for environment variables
console.log("Environment Variables:");
console.log("CHAIN_ID:", CHAIN_ID);
console.log("BACKEND_WALLET_ADDRESS:", BACKEND_WALLET_ADDRESS);
console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
console.log("ENGINE_URL:", process.env.ENGINE_URL);
console.log(
  "ACCESS_TOKEN:",
  process.env.ENGINE_ACCESS_TOKEN ? "Set" : "Not Set",
);

const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ENGINE_ACCESS_TOKEN as string,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const receiver = body.receiver || body.toAddress;
    const metadataWithSupply = body.metadataWithSupply;

    if (!receiver || !metadataWithSupply) {
      return NextResponse.json(
        { error: "Missing receiver or metadataWithSupply" },
        { status: 400 },
      );
    }

    console.log(
      `Attempting to mint for receiver: ${receiver}, metadataWithSupply:`,
      metadataWithSupply,
    );
    console.log("Using CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

    const res = await engine.erc1155.mintTo(
      CHAIN_ID,
      CONTRACT_ADDRESS,
      BACKEND_WALLET_ADDRESS,
      {
        receiver,
        metadataWithSupply,
      },
    );

    // Return immediately with queued status
    const initialResult = {
      queueId: res.result.queueId,
      status: "Queued" as const,
      toAddress: receiver,
      amount: metadataWithSupply.supply || "1",
      timestamp: Date.now(),
      chainId: Number.parseInt(CHAIN_ID),
      network: "Base Sep" as const,
    };

    // Start polling in the background
    pollToMine(res.result.queueId).then((pollResult) => {
      // This will be handled by the frontend polling
      console.log("Transaction completed:", pollResult);
    });

    return NextResponse.json(initialResult);
  } catch (error: unknown) {
    console.error("Error minting ERC1155 tokens", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error minting ERC1155 tokens", details: error.message },
        { status: 500 },
      );
    }
  }
}

async function pollToMine(queueId: string) {
  try {
    const status = await engine.transaction.status(queueId);

    if (status.result.status === "mined") {
      const transactionHash = status.result.transactionHash;
      const blockExplorerUrl = `https://base-sepolia.blockscout.com/tx/${transactionHash}`;
      return { status: "Mined", transactionHash, blockExplorerUrl };
    }

    return { status: status.result.status };
  } catch (error) {
    console.error("Error checking transaction status:", error);
    return {
      status: "error",
      errorMessage: "Failed to check transaction status",
    };
  }
}
