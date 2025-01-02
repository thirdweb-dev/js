import { Engine } from "@thirdweb-dev/engine";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CHAIN_ID = "84532";
const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;

const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ENGINE_ACCESS_TOKEN as string,
});

interface MintResult {
  queueId: string;
  status: "Queued" | "Sent" | "Mined" | "error";
  transactionHash?: string;
  blockExplorerUrl?: string;
  errorMessage?: string;
  toAddress: string;
  amount: string;
  chainId: number;
  network: "Base Sep";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { contractAddress, data } = body;
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Empty data array" }, { status: 400 });
    }

    console.log(`Attempting to mint batch to ${data.length} receivers`);
    console.log("Using CONTRACT_ADDRESS:", contractAddress);

    const res = await engine.erc20.mintBatchTo(
      CHAIN_ID,
      contractAddress,
      BACKEND_WALLET_ADDRESS,
      {
        data: data.map((item) => ({
          toAddress: item.toAddress,
          amount: item.amount,
        })),
      },
    );

    console.log("Mint batch initiated, queue ID:", res.result.queueId);
    const result = await pollToMine(res.result.queueId, data[0]);
    return NextResponse.json([result]);
  } catch (error: unknown) {
    console.error("Error minting ERC20 tokens", error);
    return NextResponse.json(
      [
        {
          queueId: "",
          status: "error",
          errorMessage:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          toAddress: "",
          amount: "",
          chainId: Number.parseInt(CHAIN_ID),
          network: "Base Sep",
        },
      ],
      { status: 500 },
    );
  }
}

async function pollToMine(
  queueId: string,
  firstItem: { toAddress: string; amount: string },
): Promise<MintResult> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      const status = await engine.transaction.status(queueId);

      if (status.result.status === "mined") {
        console.log(
          "Transaction mined! 🥳 ERC20 tokens have been minted",
          queueId,
        );
        const transactionHash = status.result.transactionHash;
        const blockExplorerUrl = `https://base-sepolia.blockscout.com/tx/${transactionHash}`;
        console.log("View transaction on the blockexplorer:", blockExplorerUrl);
        return {
          queueId,
          status: "Mined",
          transactionHash: transactionHash ?? undefined,
          blockExplorerUrl: blockExplorerUrl,
          toAddress: firstItem.toAddress,
          amount: firstItem.amount,
          chainId: Number.parseInt(CHAIN_ID),
          network: "Base Sep",
        };
      }

      if (status.result.status === "errored") {
        console.error("Mint failed", queueId);
        console.error(status.result.errorMessage);
        return {
          queueId,
          status: "error",
          errorMessage: status.result.errorMessage ?? "Unknown error occurred",
          toAddress: firstItem.toAddress,
          amount: firstItem.amount,
          chainId: Number.parseInt(CHAIN_ID),
          network: "Base Sep",
        };
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  return {
    queueId,
    status: "error",
    errorMessage: "Transaction did not mine within the expected time",
    toAddress: firstItem.toAddress,
    amount: firstItem.amount,
    chainId: Number.parseInt(CHAIN_ID),
    network: "Base Sep",
  };
}
