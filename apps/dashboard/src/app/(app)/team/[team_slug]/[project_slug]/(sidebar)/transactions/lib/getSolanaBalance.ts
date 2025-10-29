import { configure, getSolanaWalletBalance } from "@thirdweb-dev/api";
import { THIRDWEB_API_HOST } from "@/constants/urls";

// Configure the API client to use the correct base URL
configure({
  override: {
    baseUrl: THIRDWEB_API_HOST,
  },
});

export async function fetchSolanaBalance({
  publicKey,
  authToken,
  clientId,
  chainId = "solana:mainnet",
}: {
  publicKey: string;
  authToken: string;
  clientId: string;
  chainId?: "solana:mainnet" | "solana:devnet";
}): Promise<{
  displayValue: string;
  symbol: string;
  value: string;
  decimals: number;
} | null> {
  try {
    const response = await getSolanaWalletBalance({
      path: {
        address: publicKey,
      },
      query: {
        chainId,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "x-client-id": clientId,
      },
    });

    if (response.error || !response.data) {
      console.error(
        "Error fetching Solana balance:",
        response.error || "No data returned",
      );
      return null;
    }

    return {
      displayValue: response.data.result.displayValue,
      symbol: "SOL",
      value: response.data.result.value,
      decimals: response.data.result.decimals,
    };
  } catch (error) {
    console.error("Error fetching Solana balance:", error);
    return null;
  }
}
