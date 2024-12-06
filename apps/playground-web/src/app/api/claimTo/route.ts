import { Engine } from "@thirdweb-dev/engine";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BASESEP_CHAIN_ID = "84532";
const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;

const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ENGINE_ACCESS_TOKEN as string,
});

type TransactionStatus = "Queued" | "Sent" | "Mined" | "error";

interface ClaimResult {
  queueId: string;
  status: TransactionStatus;
  transactionHash?: string | undefined | null;
  blockExplorerUrl?: string | undefined | null;
  errorMessage?: string;
  toAddress?: string;
  amount?: string;
  chainId?: string;
  timestamp?: number;
}

// Store ongoing polling processes
const pollingProcesses = new Map<string, NodeJS.Timeout>();

// Helper function to make a single claim
async function makeClaimRequest(
  chainId: string,
  contractAddress: string,
  data: {
    recipient: string;
    quantity: number;
  },
): Promise<ClaimResult> {
  try {
    // Validate the recipient address format
    if (!data.recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error("Invalid wallet address format");
    }

    const res = await engine.erc721.claimTo(
      chainId,
      contractAddress,
      BACKEND_WALLET_ADDRESS,
      {
        receiver: data.recipient.toString(),
        quantity: data.quantity.toString(),
        txOverrides: {
          gas: "530000",
          maxFeePerGas: "1000000000",
          maxPriorityFeePerGas: "1000000000",
        },
      },
    );

    const initialResponse: ClaimResult = {
      queueId: res.result.queueId,
      status: "Queued",
      toAddress: data.recipient,
      amount: data.quantity.toString(),
      chainId,
      timestamp: Date.now(),
    };

    startPolling(res.result.queueId);
    return initialResponse;
  } catch (error) {
    console.error("Claim request error:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.receiver || !body.quantity || !body.contractAddress) {
      return NextResponse.json(
        { error: "Missing receiver, quantity, or contract address" },
        { status: 400 },
      );
    }

    // Validate contract address format
    if (!body.contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: "Invalid contract address format" },
        { status: 400 },
      );
    }

    const result = await makeClaimRequest(
      BASESEP_CHAIN_ID,
      body.contractAddress,
      {
        recipient: body.receiver,
        quantity: Number.parseInt(body.quantity),
      },
    );

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 400 },
    );
  }
}

function startPolling(queueId: string) {
  const maxPollingTime = 5 * 60 * 1000; // 5 minutes timeout
  const startTime = Date.now();

  const pollingInterval = setInterval(async () => {
    try {
      // Check if we've exceeded the maximum polling time
      if (Date.now() - startTime > maxPollingTime) {
        clearInterval(pollingInterval);
        pollingProcesses.delete(queueId);
        console.log(`Polling timeout for queue ID: ${queueId}`);
        return;
      }

      const result = await pollToMine(queueId);
      if (result.status === "Mined" || result.status === "error") {
        clearInterval(pollingInterval);
        pollingProcesses.delete(queueId);
        console.log("Final result:", result);
      }
    } catch (error) {
      console.error("Error in polling process:", error);
      clearInterval(pollingInterval);
      pollingProcesses.delete(queueId);
    }
  }, 1500);

  pollingProcesses.set(queueId, pollingInterval);
}

async function pollToMine(queueId: string): Promise<ClaimResult> {
  console.log(`Polling for queue ID: ${queueId}`);
  const status = await engine.transaction.status(queueId);
  console.log(`Current status: ${status.result.status}`);

  switch (status.result.status) {
    case "queued":
      console.log("Transaction is queued");
      return { queueId, status: "Queued" };
    case "sent":
      console.log("Transaction is submitted to the network");
      return { queueId, status: "Sent" };
    case "mined": {
      console.log(
        "Transaction mined! 🥳 ERC721 token has been claimed",
        queueId,
      );
      const transactionHash = status.result.transactionHash;
      const blockExplorerUrl =
        status.result.chainId === BASESEP_CHAIN_ID
          ? `https://base-sepolia.blockscout.com/tx/${transactionHash}`
          : "";
      console.log("View transaction on the blockexplorer:", blockExplorerUrl);
      return {
        queueId,
        status: "Mined",
        transactionHash: transactionHash ?? undefined,
        blockExplorerUrl: blockExplorerUrl,
      };
    }
    case "errored":
      console.error("Claim failed", queueId);
      console.error(status.result.errorMessage);
      return {
        queueId,
        status: "error",
        errorMessage: status.result.errorMessage || "Transaction failed",
      };
    default:
      return { queueId, status: "Queued" };
  }
}

// Add a new endpoint to check the status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const queueId = searchParams.get("queueId");

  if (!queueId) {
    return NextResponse.json({ error: "Missing queueId" }, { status: 400 });
  }

  try {
    const result = await pollToMine(queueId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking transaction status:", error);
    return NextResponse.json(
      {
        status: "error" as TransactionStatus,
        error: "Failed to check transaction status",
      },
      { status: 500 },
    );
  }
}
